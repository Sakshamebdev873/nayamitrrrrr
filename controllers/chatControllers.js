import { GoogleGenAI } from "@google/genai";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import fs from "fs";
import UserCaseForm from '../models/UserCaseForm.js'
import path from "path";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });
// const ai1 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
    model: "gemini-2.0-flash",
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
  // console.log(req.userId);
  
  // 1. Enhanced cookie logging
  // console.log('Raw cookie:', req.cookies?.sessionId);
  // console.log('Signed cookie:', req.signedCookies?.sessionId);
  const cookieSessionId = (req.signedCookies.sessionId || req.cookies.sessionId || "").toString().trim();
  // console.log('Normalized cookie ID:', `"${cookieSessionId}"`);

  // 2. Verify user exists with sessions
  const user = await User.findById(id).select('chatSession');
  if (!user) {
    // console.error(`User ${id} not found`);
    return res.status(404).json({ 
      success: false,
      message: "User not found",
      debug: { receivedUserId: id }
    });
  }

  // 3. Deep inspection of stored sessions
  const allSessions = user.chatSession || [];
  // console.log(`Found ${allSessions.length} sessions:`);
  allSessions.forEach((s, i) => {
    const storedId = s.sessionId?.toString().trim();
    console.log(`Session ${i}:`, {
      storedId: `"${storedId}"`,
      match: storedId === cookieSessionId,
      typeMatch: typeof storedId === typeof cookieSessionId
    });
  });

  // 4. Flexible matching (whitespace/case insensitive)
  const currentSession = allSessions.find(session => {
    const storedId = session.sessionId?.toString().trim();
    return storedId?.toLowerCase() === cookieSessionId.toLowerCase();
  });

  // 5. Final verification before response
  if (!currentSession) {
    console.warn('No matching session found for:', {
      cookieSessionId,
      availableIds: allSessions.map(s => s.sessionId?.toString().trim())
    });
  }

  res.status(200).json({
    success: true,
    currentSession: currentSession || null,
   otherSessions: allSessions
  .filter(s => s.sessionId?.toString().trim() !== cookieSessionId)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    _debug: {
      cookieReceived: cookieSessionId,
      matchedSessionId: currentSession?.sessionId,
      allSessionIds: allSessions.map(s => s.sessionId)
    }
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
  "Do you know any two Fundamental Rights under the Indian Constitution?",
  "Have you faced discrimination by gender, caste, religion, or other? Briefly explain.",
  "Have you seen or experienced legal violations (e.g., domestic violence, harassment)? Describe.",
  "Do you know how to file an FIR? List the main steps.",
  "How familiar are you with BNS and BNSS? How do they protect citizens?"
];
export const surveyQuestion = async (req, res) => {
  res.status(200).json({ questions: surveyQuestions });
};

// Helper function to generate the prompt for Gemini LLM

const generateGeminiPrompt = (responses) => {
  const [q1, q2, q3, q4, q5] = responses;

  return `
User Legal Awareness Survey Responses:
1. Fundamental Rights awareness: ${q1}  
2. Discrimination experience: ${q2}  
3. Observed or experienced legal violations: ${q3}  
4. Knowledge of filing an FIR: ${q4}  
5. Familiarity with BNS and BNSS protections: ${q5}

Analysis Task:
1. First, identify any direct indicators of rights violations (especially in Q2 and Q3)
2. Assess the severity level of each concern (low/medium/high)
3. Consider the user's awareness level (Q1, Q4, Q5) as it affects their ability to address issues
4. Calculate a percentage likelihood of rights violation based on:
   - Number of concerning responses
   - Severity of each concern
   - User's ability to seek help (awareness factors)

Required Output Format:
"Summary: [1-sentence summary of concerns]
Helpline: [Relevant contact number]
Next Step: [Immediate action suggestion]
Awareness Percentage: XX% 
Reasoning: [2-3 sentences explaining the percentage]
#NyayaPrompt: [Concise prompt for detailed guidance]"

Important Notes:
- The percentage must directly reflect the severity and quantity of issues in the responses
- Higher percentage for: active violations, discrimination cases, low awareness
- Lower percentage for: general awareness issues without active violations
- Be specific about how each response contributes to the percentage
`;
};

export const submitSurvey = asyncHandler(async (req, res) => {
  const { responses } = req.body;

  if (!responses || responses.length !== 5) { // Changed to fixed number 5
    return res.status(400).json({ error: "Please answer all 5 survey questions." });
  }

  try {
    const prompt = generateGeminiPrompt(responses);
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Using more capable model
      contents: prompt,
    });

    const fullText = result.text.trim();
    // console.log("Gemini Raw Output:", fullText); // Log for debugging

    // Enhanced percentage extraction
    const percentageMatch = fullText.match(/Awareness Percentage:\s*(\d{1,3})%/);
    let awarenessPercentage = percentageMatch ? parseInt(percentageMatch[1], 10) : null;

    // Validate percentage range
    if (awarenessPercentage !== null && (awarenessPercentage < 0 || awarenessPercentage > 100)) {
      awarenessPercentage = null;
    }

    // Extract other components
    const summaryMatch = fullText.match(/Summary:\s*(.+?)(?=\nHelpline:|$)/s);
    const helplineMatch = fullText.match(/Helpline:\s*(.+?)(?=\nNext Step:|$)/s);
    const nextStepMatch = fullText.match(/Next Step:\s*(.+?)(?=\nAwareness Percentage:|$)/s);
    const reasoningMatch = fullText.match(/Reasoning:\s*(.+?)(?=\n#NyayaPrompt:|$)/s);
    const nyayaPromptMatch = fullText.match(/#NyayaPrompt:\s*(.+)/s);

    let suggestion;
    if (awarenessPercentage === null) {
      suggestion = "We couldn't determine your risk level. Please contact the National Human Rights Commission at 1800-123-456 for direct assistance.";
    } else if (awarenessPercentage >= 70) {
      suggestion = `Urgent attention needed (${awarenessPercentage}% risk). ${nextStepMatch?.[1] || 'Contact legal aid immediately.'}`;
    } else if (awarenessPercentage >= 40) {
      suggestion = `Potential concerns (${awarenessPercentage}% risk). ${nextStepMatch?.[1] || 'Consider consulting a legal professional.'}`;
    } else {
      suggestion = `Low current risk (${awarenessPercentage}%). ${nextStepMatch?.[1] || 'Stay informed about your rights.'}`;
    }

    res.status(200).json({
      message: "Survey analysis completed",
      summary: summaryMatch?.[1]?.trim() || "No significant issues detected",
      helpline: helplineMatch?.[1]?.trim() || "National Legal Services Authority: 15100",
      nextStep: nextStepMatch?.[1]?.trim() || "Review your rights on our website",
      awarenessPercentage: awarenessPercentage ?? "Unavailable",
      reasoning: reasoningMatch?.[1]?.trim() || "Insufficient data for detailed analysis",
      nyayaPrompt: nyayaPromptMatch?.[1]?.trim() || "#NyayaPrompt: Explain my fundamental rights under Indian Constitution",
      fullAnalysis: fullText
    });

  } catch (err) {
    console.error("Survey submission error:", err);
    res.status(500).json({ 
      error: "Analysis failed",
      fallbackHelpline: "National Commission for Women: 7827-170-170",
      suggestion: "Please try again or contact the helpline directly"
    });
  }
});
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
  paymentMode,
  refNumber,
  paymentDate,
  issuingAuthority,
  amount,
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
   भुगतान का माध्यम: ${paymentMode || "Not Provided"}
   संदर्भ संख्या: ${refNumber || "Not Provided"}
   भुगतान की तिथि: ${paymentDate || "Not Provided"}
   जारीकर्ता संस्था: ${issuingAuthority || "Not Provided"}
   राशि: ₹${amount || "Not Provided"}/-
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
   Mode of Payment: ${paymentMode || "Not Provided"}
   Reference Number: ${refNumber || "Not Provided"}
   Payment Date: ${paymentDate || "Not Provided"}
   Issuing Authority: ${issuingAuthority || "Not Provided"}
   Amount Paid: Rs. ${amount || "Not Provided"}/-
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
      paymentMode,
  refNumber,
  paymentDate,
  issuingAuthority,
  amount,
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
        paymentMode,
  refNumber,
  paymentDate,
  issuingAuthority,
  amount,
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
export const changeSession = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ msg: "Session ID is required" });
  }

  // Clear existing cookie (must match the same settings)
  res.clearCookie("sessionId", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "Lax",
  });

  // Set new cookie
  res.cookie("sessionId", sessionId, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // false in dev, true in prod
    sameSite: "Lax",
  });

  res.status(200).json({ msg: "Session updated", sessionId });
};
export const deleteSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.userId?._id || req.params.id; // Adapt based on your auth

  if (!sessionId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Both sessionId and userId are required"
    });
  }

  try {
    // Find and update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { chatSession: { sessionId } } },
      { new: true }
    ).select('chatSession');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if session was actually removed
    const sessionExists = updatedUser.chatSession.some(
      session => session.sessionId === sessionId
    );

    if (sessionExists) {
      return res.status(400).json({
        success: false,
        message: "Session could not be deleted"
      });
    }

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
      remainingSessions: updatedUser.chatSession
    });

  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
export const newSessionId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(400).json({ msg: "User does not exist." });

  // 1. Clear old cookie (unsigned)
  res.clearCookie("sessionId", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "Lax",
  });

  // 2. Generate new JWT
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    "secret", // Use process.env.JWT_SECRET in production
    { expiresIn: "1d" }
  );

  // 3. Set new unsigned cookie
  res.cookie("sessionId", token, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "Lax",
  });

  res.status(200).json({
    msg: "New session ID created",
    token, // Raw JWT (matches cookie)
  });
});


export const submitUserCaseForm = asyncHandler(async (req, res) => {
  const { userId, caseType, caseStage, caseFacts, jurisdiction, courtType, userRole } = req.body;

  if (!userId) {
    console.log(userId);
    return res.status(400).json({ msg: 'please enter user id.' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  // PROMPTS with jurisdiction and courtType included
  const procedurePrompt = `
You are a legal assistant. Based on Indian legal procedures for a "${caseType}" case in "${courtType}" court under the "${jurisdiction}" jurisdiction, provide a step-by-step legal roadmap.

User Role: ${userRole}
Respond in clear bullet points. Each bullet point must be only 1–2 lines and focused on practical steps. Keep it concise and action-oriented.

Facts: "${caseFacts}"
`.trim();

  const assistingPrompt = `
You are a legal research assistant. For a "${caseType}" case in "${courtType}" court under "${jurisdiction}" jurisdiction, analyze the following facts:

User Role: ${userRole}
"${caseFacts}"

List key supporting documents or arguments used in similar successful cases. Keep each bullet point under 2 lines. Use plain legal English and avoid long explanations.
`.trim();

  const nextMovesPrompt = `
You are an AI legal planner. Based on this case: "${caseType}" in "${courtType}" court, jurisdiction: "${jurisdiction}", facts: "${caseFacts}", and user role: "${userRole}", list the user's next 3–5 recommended steps.

Each bullet should be short (max 2 lines), practical, and follow Indian legal procedure. Start directly with the action.
`.trim();

  // Generate Gemini content
  const [procedureRes, assistingRes, nextMovesRes] = await Promise.all([
    ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: procedurePrompt }] }]
    }),
    ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: assistingPrompt }] }]
    }),
    ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: nextMovesPrompt }] }]
    }),
  ]);

  // Save to DB
  const newCase = await UserCaseForm.create({
    userId,
    caseType,
    caseStage,
    jurisdiction,
    courtType,
    userRole,
    caseFacts,
    procedure: procedureRes.text.trim(),
    assistingDocuments: assistingRes.text.trim(),
    nextMoves: nextMovesRes.text.trim(),
  });

  res.status(201).json({
    msg: 'Case created successfully',
    caseId: newCase._id,
    procedure: newCase.procedure,
    assistingDocuments: newCase.assistingDocuments,
    nextMoves: newCase.nextMoves,
  });
});

export const getUserCaseHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Invalid user ID' });
  }

  const cases = await UserCaseForm.find({ userId :id }).sort({ createdAt: -1 });

  res.status(200).json({
    msg: 'Case history fetched successfully',
    count: cases.length,
    cases,
  });
});
// export const updateUserCaseForm = asyncHandler(async (req, res) => {
//   const { caseId } = req.params;
//   const { caseType, caseStage, caseFacts, jurisdiction, courtType } = req.body;

//   const existingCase = await UserCaseForm.findById(caseId);
//   if (!existingCase) {
//     return res.status(404).json({ msg: 'Case not found' });
//   }

//   // AI prompts
//   const procedurePrompt = `
// You are a legal assistant. Based on Indian legal procedures for a "${caseType}" case in "${courtType}" court under the "${jurisdiction}" jurisdiction, provide a step-by-step legal roadmap.

// Respond in clear bullet points. Each bullet point must be only 1–2 lines and focused on practical steps. Keep it concise and action-oriented.

// Facts: "${caseFacts}"
// `.trim();

//   const assistingPrompt = `
// You are a legal research assistant. For a "${caseType}" case in "${courtType}" court under "${jurisdiction}" jurisdiction, analyze the following facts:

// "${caseFacts}"

// List key supporting documents or arguments used in similar successful cases. Keep each bullet point under 2 lines. Use plain legal English and avoid long explanations.
// `.trim();

//   const nextMovesPrompt = `
// You are an AI legal planner. Based on this case: "${caseType}" in "${courtType}" court, jurisdiction: "${jurisdiction}", and facts: "${caseFacts}", list the user's next 3–5 recommended steps.

// Each bullet should be short (max 2 lines), practical, and follow Indian legal procedure. Start directly with the action.
// `.trim();

//   // Generate updated content
//   const [procedureRes, assistingRes, nextMovesRes] = await Promise.all([
//     ai.models.generateContent({
//       model: 'gemini-2.5-pro-exp-03-25',
//       contents: [{ role: 'user', parts: [{ text: procedurePrompt }] }]
//     }),
//     ai.models.generateContent({
//       model: 'gemini-2.5-pro-exp-03-25',
//       contents: [{ role: 'user', parts: [{ text: assistingPrompt }] }]
//     }),
//     ai.models.generateContent({
//       model: 'gemini-2.5-pro-exp-03-25',
//       contents: [{ role: 'user', parts: [{ text: nextMovesPrompt }] }]
//     }),
//   ]);

//   existingCase.caseType = caseType;
//   existingCase.caseStage = caseStage;
//   existingCase.caseFacts = caseFacts;
//   existingCase.jurisdiction = jurisdiction;
//   existingCase.courtType = courtType;
//   existingCase.procedure = procedureRes.text.trim();
//   existingCase.assistingDocuments = assistingRes.text.trim();
//   existingCase.nextMoves = nextMovesRes.text.trim();

//   await existingCase.save();

//   res.status(200).json({
//     msg: 'Case updated successfully',
//     case: existingCase,
//   });
// });
export const deleteCaseHistory = asyncHandler(async (req, res) => {
  const { userId, caseId } = req.params;

  // Validate both IDs
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(caseId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: {
        code: 'INVALID_ID',
        details: 'Both user ID and case ID must be valid MongoDB ObjectIds'
      }
    });
  }

  try {
    // Find and delete the case only if it belongs to the specified user
    const result = await UserCaseForm.findOneAndDelete({
      _id: caseId,
      userId: userId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Case not found or user mismatch',
        error: {
          code: 'NOT_FOUND',
          details: 'Either the case does not exist or does not belong to this user'
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Case deleted successfully',
      data: {
        deletedCase: {
          id: caseId,
          caseType: result.caseType,
          createdAt: result.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Error deleting case:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete case',
      error: {
        code: 'SERVER_ERROR',
        details: error.message
      }
    });
  }
});

