import { GoogleGenAI } from "@google/genai";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });
const ai1 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Multilingual Legal System Prompts

const getLegalSystemPrompt = (lang) => {
  const prompts = {
    en: `
You are an AI legal assistant integrated into the Department of Justice website, focused on Indian laws and services.

Your goal is to **understand the user's legal situation by asking for context** first. Only once you have sufficient details, you should:

1. Recognize the possible **legal violations** involved (e.g., domestic violence, workplace harassment, property dispute, etc.).
2. Share the **relevant helpline numbers** or emergency contacts.
3. Explain the **legal protections, rights, or remedies** available under Indian law.
4. Suggest safe and actionable **next steps** (e.g., where to file a complaint, how to draft an FIR, who to contact).

Your response must:
- Always **begin by asking for more context** in a caring, supportive, and non-judgmental tone.
- Never give personal legal advice or make assumptions without facts.
- Be written in plain, simple English.
- Be aligned with official Indian legal procedures.

Example:
User: *"My husband is hurting me and drinking every night."*  
You: *"I'm really sorry you're going through this. Could you tell me a bit more—does he physically harm you, or threaten or control you in other ways? Knowing a little more will help me guide you better under Indian law."*

Do not skip directly to solutions. Always listen first.
`.trim(),

    // You can create similar versions for other languages:
    // hi, ta, bn, te...
  };

  return prompts[lang] || prompts["en"];
};

export const createChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prompt } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid user ID" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  let sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    const token = jwt.sign({ userId: user._id, name: user.name }, "secret", {
      expiresIn: "1d",
    });

    const oneDay = 24 * 60 * 60 * 1000;
    res.cookie("sessionId", token, {
      maxAge: oneDay,
      signed: true,
      secure: false,
    });

    sessionId = token;
  }

  let session = user?.chatSession?.find((s) => s.sessionId === sessionId);

  const recentMessages = session?.messages?.length
    ? [session.messages[0], ...session.messages.slice(-8)]
    : [];

  const history = recentMessages.map((msg) => ({
    role: msg.role === "user" ? "user" : "assistant",
    content: msg.role === "user" ? msg.prompt : msg.response,
  }));

const legalSystemPrompt = `
You are “NyayaMitr” an AI legal assistant embedded in the Department of Justice website. Your expertise is Indian law and services.

1. FAST-PATH HANDLING  
   • If the user’s very first message clearly states their legal issue (e.g., “My husband hit me last night,” “I want to file an RTI”), immediately:
      Identify the probable violation or request (domestic violence, RTI application, property dispute, etc.)  
      Provide 2–3 key helpline numbers (e.g., 1091 Women’s Helpline, 100 Police, 112 Emergency).  
      Offer 2–3 *Quick Actions* (e.g., “Seek a safe place,” “Call police now,” “Visit our RTI portal”).  

2. TARGETED FOLLOW-UPS (MAX 2)  
   • Only if essential details are missing (date, location, parties involved, etc.), ask *one* precise question at a time (e.g., “Could you tell me when this happened?”).  
   • Avoid broad “tell me more” prompts.  

3. FEATURE INTEGRATION  
   • Once the issue and basics are covered, seamlessly surface built-in site tools:  
      “Would you like me to draft an FIR for you now?”  
      “Or you can go to our Generate Documents section, select ‘FIR,’ and fill in your incident details.”  

4. EMPATHY & TONE  
   • Always open with a caring, non-judgmental acknowledgement (“I’m really sorry this happened”).  
   • Use simple, everyday language; explain any legal term before using it.  

5. LEGAL ACCURACY & BOUNDARIES  
   • Base all advice strictly on user-provided facts; never assume or fabricate details.  
   • Align with official Indian procedures (IPC, CrPC, Protection of Women from Domestic Violence Act, RTI Act, etc.).  
   • Never give personal legal advice or opinions beyond procedures and resources.  

6. ROBUSTNESS & SAFEGUARDS  
   • If the user’s request is unclear or out of scope, respond with a brief clarification request (“I’m sorry, could you clarify X?”).  
   • Use session context to recall prior details in the conversation, reducing repetition.  
   • For emotionally sensitive topics, be extra gentle and offer emergency contacts first.  

  `.trim();
  const historyText = history
    .map(
      (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
    )
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro-exp-03-25",
    contents: [
      {
        role: "user",
        parts: [
          { text: legalSystemPrompt },
          { text: `Conversation History:\n${historyText}` },
          { text: `User's Query: "${prompt}"` },
        ],
      },
    ],
  });

  const outputText = response.text.trim();

  // If new session, create one and push it to the user
  if (!session) {
    const titleResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Create a two-word title summarizing this user input: "${prompt}"`,
            },
          ],
        },
      ],
    });

    const title = titleResponse.text.trim();

    const newSession = {
      sessionId,
      title,
      messages: [],
    };

    user.chatSession.push(newSession);
    session = user.chatSession[user.chatSession.length - 1];
  }

  // Push user and assistant messages
  session.messages.push(
    {
      role: "user",
      prompt,
      response: "",
      tokensUsed: "",
      timestamp: new Date(),
    },
    {
      role: "assistant",
      prompt: "",
      response: outputText,
      tokensUsed: "",
      timestamp: new Date(),
    }
  );

  user.markModified("chatSession");
  await user.save();

  res.status(200).json({
    msg: outputText,
    sessionId,
  });
});

export const getHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sessionId = (req.signedCookies.sessionId || "").trim();

  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ msg: "User does not exist" });
  }

  const allSessions = user.chatSession || [];

  const currentSession = allSessions.find(
    (session) => session.sessionId.trim() === sessionId
  );
  const otherSessions = allSessions.filter(
    (session) => session.sessionId.trim() !== sessionId
  );
  // Prevent 304 by disabling caching
  res.set({
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    Expires: "0",
  });

  res.status(200).json({
    currentSession: currentSession || null,
    otherSessions,
  });
});

export const getNearbyJudiciaryOSM = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  const radius = 5000; // 5 km

  const query = `
    [out:json];
    (
      node["amenity"="courthouse"](around:${radius},${lat},${lng});
      node["amenity"="police"](around:${radius},${lat},${lng});
    );
    out body;
  `;

  try {
    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      `data=${encodeURIComponent(query)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const results = response.data.elements.map((place) => ({
      name: place.tags.name || "Unnamed",
      lat: place.lat,
      lng: place.lon,
      type: place.tags.amenity,
    }));

    res.json({ results });
  } catch (error) {
    console.error("Overpass error:", error.message);
    res.status(500).json({ error: "Failed to fetch judiciary locations." });
  }
};

const surveyQuestions = [
  "Are you aware of your fundamental rights?",
  "Have you ever faced discrimination based on gender, caste, religion, or any other factor?",
  "Have you experienced or witnessed any legal violation in your community?",
  "Are you aware of how to file a complaint regarding legal violations?",
  "Do you feel your rights are protected by the current legal system?",
];
export const surveyQuestion = async (req, res) => {
  res.status(200).json({ questions: surveyQuestions });
};

// Helper function to generate the prompt for Gemini LLM

const generateGeminiPrompt = (responses) => {
  const [q1, q2, q3, q4, q5] = responses;

  return `The following are the responses from a user about their fundamental rights:

1. Awareness of fundamental rights: ${q1}
2. Experiences of discrimination: ${q2}
3. Legal violations they have witnessed: ${q3}
4. Knowledge of how to file complaints: ${q4}
5. Perceived protection of their rights by the legal system: ${q5}

Based on these responses, analyze whether any of the user's fundamental rights are being violated. Provide a summary and explain your conclusion.`;
};

// Helper function to analyze Gemini's response
const analyzeRightsViolation = (analysis) => {
  // Check for certain keywords in Gemini's response to determine if rights are violated
  const violationKeywords = [
    "discrimination",
    "violated",
    "unlawful",
    "infringed",
    "denied",
  ];

  for (const keyword of violationKeywords) {
    if (analysis.toLowerCase().includes(keyword)) {
      return true;
    }
  }

  return false;
};

export const submitSurvey = asyncHandler(async (req, res) => {
  const { userId, responses } = req.body;

  if (!userId || !responses || responses.length !== surveyQuestions.length) {
    return res.status(400).json({ error: "Invalid survey data." });
  }

  try {
    // Create a prompt for Gemini based on user responses
    const prompt = generateGeminiPrompt(responses);

    // Call Gemini LLM for analysis
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Use the appropriate Gemini model
      contents: prompt,
    });

    const analysis = result.text.trim();

    // Determine the result (whether rights are violated or not)
    const violationDetected = analyzeRightsViolation(analysis);

    res.status(200).json({
      message: violationDetected
        ? "Potential violation of rights detected. Please take necessary actions."
        : "No rights violations detected. Your rights are protected.",
      analysis: analysis,
      Suggestion: violationDetected
        ? "Please let me help you to file an FIR "
        : "You are safe....",
    });
  } catch (err) {
    console.error("Survey submission error:", err);
    res.status(500).json({ error: "Failed to analyze the survey." });
  }
});
export const suggestAlternativeResolution = async (req, res) => {
  const { caseType, details } = req.body;

  // if (!caseType || caseType.toLowerCase() !== "divorce property") {
  //   return res.status(400).json({
  //     error: 'Only "Divorce Property" case type is currently supported.',
  //   });
  // }

  const prompt = `
  You are a legal advisor AI helping users understand whether their "Divorce Property" dispute can be resolved outside of court in India.
  
  Please analyze the following case:
  "${details}"
  
  Respond with:
  1. A brief analysis of the case in plain language.
  2. Whether the user's legal or constitutional rights are being violated.
  3. Recommendations for out-of-court resolution methods (e.g., mediation, arbitration, Lok Adalat).
  4. Include **real and trustworthy Indian platforms or services** where users can access certified mediators. Provide actual links. Examples include:
  
  - NALSA (National Legal Services Authority): https://nalsa.gov.in
  - eCourts Services for Lok Adalats and Mediation: https://ecourts.gov.in
  - SAMADHAN Mediation (Delhi High Court): http://www.samadhan.delhihighcourt.nic.in
  - LegalKart (private legal help): https://www.legalkart.com
  - LawRato (legal consultation): https://lawrato.com
  - Presolv360 (online dispute resolution): https://presolv360.com
  
  Make your response easy to understand and useful for a non-lawyer citizen.
  If needed, suggest next steps or helplines too.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const response = await result.text.trim();
    // const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated.";

    res.status(200).json({
      message: "Alternative resolution suggestion generated successfully.",
      aiResponse: response,
    });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Failed to generate suggestion using AI." });
  }
};

export const analyzePdf = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), req.file.path);
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);
    const extractedText = data.text;

    // ✅ Await the model call
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Summarize this legal document:\n\n${extractedText}`,
    });

    // ✅ Then await result.text()
    const summary = await result.text.trim();

    res.status(200).json({
      summary,
      originalText: extractedText.slice(0, 1000), // send only first 1000 chars if needed
    });
  } catch (err) {
    console.error("PDF Analysis Error:", err);
    res.status(500).json({ error: "Failed to analyze PDF" });
  }
};

// Helper functions to prepare the prompt for FIR or RTI


const rtiPrompt = (
  language,
  fullName,
  fatherOrHusbandName,
  address,
  pinCode,
  officePhone,
  residencePhone,
  mobile,
  isBPL,
  feeDetails,
  infoRequired,
  preferredFormat,
  place,
  date
) => {
  if (language === "Hindi") {
    return `आप एक कानूनी सहायक एआई हैं। नीचे दिए गए विवरणों के आधार पर, कृपया सूचना का अधिकार अधिनियम 2005 के अंतर्गत एक औपचारिक आवेदन पत्र तैयार करें।

निर्देश:
- आवेदन पत्र को इस शीर्षक से प्रारंभ करें: "सूचना के अधिकार अधिनियम 2005 के अंतर्गत सूचना प्राप्त करने हेतु आवेदन प्रपत्र"
- प्राप्तकर्ता: केंद्रीय जन सूचना अधिकारी, पर्यटन मंत्रालय, भारत सरकार, C-1 हटमेंट्स, डलहौज़ी रोड, नई दिल्ली – 110011
- क्रमांक 1 से 7 तक स्पष्ट रूप से विवरण भरें
- अंत में निम्नलिखित घोषणा जोड़ें:
  "मैं यह घोषणा करता/करती हूं कि मांगी गई सूचना आरटीआई अधिनियम की धारा 8 और 9 के प्रतिबंधों के अंतर्गत नहीं आती है और मेरी जानकारी के अनुसार यह आपके कार्यालय से संबंधित है।"
- स्थान और दिनांक जोड़ें
- केवल पत्र रूप में उत्तर दें — कोई अतिरिक्त टिप्पणी या व्याख्या नहीं।

आवेदक विवरण:
1. पूरा नाम: ${fullName}
2. पिता/पति का नाम: ${fatherOrHusbandName}
3. पूरा पता: ${address}
   पिन कोड: ${pinCode}
4. दूरभाष: कार्यालय - ${officePhone}, आवास - ${residencePhone}, मोबाइल - ${mobile}
5. बीपीएल श्रेणी से संबंधित: ${isBPL ? "हां (प्रमाण संलग्न करें)" : "नहीं"}
6. शुल्क विवरण: 
   भुगतान का माध्यम: ${feeDetails.paymentMode || "Not Provided"}
   संदर्भ संख्या: ${feeDetails.refNumber || "Not Provided"}
   भुगतान की तिथि: ${feeDetails.paymentDate || "Not Provided"}
   जारीकर्ता संस्था: ${feeDetails.issuingAuthority || "Not Provided"}
   राशि: ₹${feeDetails.amount || "Not Provided"}/-
7. मांगी गई जानकारी: ${infoRequired}
   वांछित प्रारूप: ${preferredFormat}

स्थान: ${place}
दिनांक: ${date}`;
  }

  return `You are a legal assistant AI. Based on the applicant’s information below, generate an RTI application in the **official format** under the Right to Information Act, 2005.

Instructions:
- Start with: "APPLICATION FORMAT FOR INFORMATION UNDER RTI ACT 2005"
- Address to: Central Public Information Officer, Ministry of Tourism, Government of India, C-1 Hutments, Dalhousie Road, New Delhi -110011
- Use numbered fields 1–7 for applicant details and query
- Add the official declaration:
  "I state that the information sought does not fall within the restrictions contained in Section 8 & 9 of the RTI Act and to the best of my knowledge it pertains to your office."
- Include Place and Date
- Output ONLY the RTI application letter no extra text

Applicant Details:
1. Full Name: ${fullName}
2. Father’s/Husband’s Name: ${fatherOrHusbandName}
3. Address: ${address}
   Pin Code: ${pinCode}
4. Telephone No: Office - ${officePhone}, Residence - ${residencePhone}, Mobile - ${mobile}
5. BPL Category: ${isBPL ? "Yes (BPL Proof Attached)" : "No"}
6. Application Fee Details: 
   Mode of Payment: ${feeDetails.paymentMode || "Not Provided"}
   Reference Number: ${feeDetails.refNumber || "Not Provided"}
   Payment Date: ${feeDetails.paymentDate || "Not Provided"}
   Issuing Authority: ${feeDetails.issuingAuthority || "Not Provided"}
   Amount Paid: Rs. ${feeDetails.amount || "Not Provided"}/-
7. Particulars of Information Required: ${infoRequired}
   Preferred Medium: ${preferredFormat}

Place: ${place}
Date: ${date}`;
};
const firPrompt = (
  description,
  language,
  policeStation,
  name,
  address,
  contact,
  occupation,
  accusedName,
  accusedAddress,
  relationshipToComplainant,
  incidentDate,
  incidentTime,
  incidentPlace,
  natureOfOffense,
  witnesses,
  evidence,
  actionRequest
) => {
  const text = `
You are a legal assistant. Based on the given incident description, draft a formal FIR complaint letter in proper format.
You must automatically include all applicable Indian laws and IPC sections relevant to the incident.
Do NOT add any explanations, optional content, metadata, headings, or extra comments.
Return ONLY the finalized FIR letter — strictly in plain letter format.
Ensure all placeholders are correctly filled based on the input context.
Language for the letter: ${language}

---
Applicant Details:
- Name: ${name}
- Address: ${address}
- Contact: ${contact}
- Occupation: ${occupation}

Accused Details:
- Name: ${accusedName}
- Address: ${accusedAddress}
- Relationship to Complainant: ${relationshipToComplainant}

Incident Details:
- Date: ${incidentDate}
- Time: ${incidentTime}
- Place: ${incidentPlace}
- Nature of Offense: ${natureOfOffense}
- Description: ${description}

Additional Info:
- Witnesses: ${witnesses}
- Evidence: ${evidence}
- Requested Action: ${actionRequest}

Police Station: ${policeStation}
---
`;

  return [
    {
      role: "user",
      parts: [{ text }],
    },
  ];
};

// Helper function for FIR prompt

export const generateDocument = asyncHandler(async (req, res) => {
  try {
    const {
      type,
      language,

      // FIR fields
      description,
      policeStation,
      name,
      address,
      contact,
      occupation,
      accusedName,
      accusedAddress,
      relationshipToComplainant,
      incidentDate,
      incidentTime,
      incidentPlace,
      natureOfOffense,
      witnesses,
      evidence,
      actionRequest,

      // RTI fields
      fullName,
      fatherOrHusbandName,
      rtiAddress,
      pinCode,
      officePhone,
      residencePhone,
      mobile,
      isBPL,
      feeDetails,
      infoRequired,
      preferredFormat,
      place,
      date,
    } = req.body;

    // Validate required fields
    if (!type || !language) {
      return res.status(400).json({ 
        error: "Missing required fields",
        details: {
          missing: [
            ...(!type ? ["type"] : []),
            ...(!language ? ["language"] : [])
          ],
          message: "Both 'type' and 'language' are required fields"
        }
      });
    }

    if (!["FIR", "RTI"].includes(type)) {
      return res.status(400).json({ 
        error: "Invalid document type",
        details: {
          received: type,
          allowed: ["FIR", "RTI"],
          message: "Document type must be either 'FIR' or 'RTI'"
        }
      });
    }

    let prompt;

    if (type === "FIR") {
      // Validate required FIR fields
      const requiredFirFields = [
        'description', 'policeStation', 'name', 'address', 
        'incidentDate', 'incidentPlace', 'natureOfOffense'
      ];
      const missingFirFields = requiredFirFields.filter(field => !req.body[field]);

      if (missingFirFields.length > 0) {
        return res.status(400).json({
          error: "Missing required FIR fields",
          details: {
            missing: missingFirFields,
            message: `FIR requires these fields: ${requiredFirFields.join(', ')}`
          }
        });
      }

      prompt = firPrompt(
        description,
        language,
        policeStation,
        name,
        address,
        contact,
        occupation,
        accusedName,
        accusedAddress,
        relationshipToComplainant,
        incidentDate,
        incidentTime,
        incidentPlace,
        natureOfOffense,
        witnesses,
        evidence,
        actionRequest
      );
    } else if (type === "RTI") {
      // Validate required RTI fields
      const requiredRtiFields = [
        'fullName', 'rtiAddress', 'infoRequired', 'place', 'date'
      ];
      const missingRtiFields = requiredRtiFields.filter(field => !req.body[field]);

      if (missingRtiFields.length > 0) {
        return res.status(400).json({
          error: "Missing required RTI fields",
          details: {
            missing: missingRtiFields,
            message: `RTI requires these fields: ${requiredRtiFields.join(', ')}`
          }
        });
      }

      prompt = rtiPrompt(
        language,
        fullName,
        fatherOrHusbandName,
        rtiAddress,
        pinCode,
        officePhone,
        residencePhone,
        mobile,
        isBPL,
        feeDetails,
        infoRequired,
        preferredFormat,
        place,
        date
      );
    }

 const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents : prompt,
  });

  const response = result.text; // Also fixed the response extraction

  res.status(200).json({
    message: `${type} draft generated successfully.`,
    draft: response,
  });
  } catch (err) {
    console.error("Document generation error:", {
      error: err,
      stack: err.stack,
      requestBody: req.body
    });

    res.status(500).json({
      error: "Document generation failed",
      details: {
        message: err.message,
        type: err.name,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        ...(err.response?.data && { apiError: err.response.data })
      }
    });
  }
});
// Helper function for FIR prompt
