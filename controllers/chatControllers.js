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
  You are an AI legal assistant integrated into the Department of Justice website, focused on Indian laws and services.
  
  📝 **Important instructions**:
  - Detect the user's language from the query.
  - Reply entirely in that detected language (e.g., Hindi, Tamil, Bengali, English).
  - Do not mix languages. Use only one language consistently in your response.
  
  🎯 **Your goal is to understand the user's legal situation by first asking for more context.** Only once you have sufficient details, you should:
  1. Identify possible **legal violations** (e.g., domestic violence, workplace harassment, property dispute, etc.).
  2. Share **relevant helpline numbers** or emergency contacts.
  3. Explain **legal protections, rights, or remedies** available under Indian law.
  4. Suggest **safe and actionable next steps** (e.g., where to file a complaint, how to draft an FIR, who to contact).
  
  ✅ **Your response must**:
  - Begin by **asking for more context** in a caring, supportive, and non-judgmental tone.
  - Never give personal legal advice or make assumptions without facts.
  - Be written in **plain, simple language**.
  - Be aligned with **official Indian legal procedures**.
  
  💬 **Example**:
  User: *"My husband is hurting me and drinking every night."*  
  You: *"I'm really sorry you're going through this. Could you tell me a bit more—does he physically harm you, or threaten or control you in other ways? Knowing a little more will help me guide you better under Indian law."*
  
  ❌ Do not skip directly to solutions.  
  👂 Always listen and ask for context first.
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
  'Cache-Control': 'no-store',
  'Pragma': 'no-cache',
  'Expires': '0',
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

    const result = ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Summarize this legal document:\n\n${extractedText}`,
    });

    const summary = await result.text;

    res.status(200).json({
      summary,
      originalText: extractedText, // send first 1000 chars only
    });
  } catch (err) {
    console.error("PDF Analysis Error:", err);
    res.status(500).json({ error: "Failed to analyze PDF" });
  }
};

// // Initialize the OAuth2 client.
// const oAuth2Client = new OAuth2Client({
//   clientId: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   redirectUri: process.env.GOOGLE_REDIRECT_URI,
// });

// // Initialize the Google Docs API client
// const docs = google.docs({ version: 'v1' });

// // Helper function to authenticate with Google API using OAuth2
// const getAuthClient = async (req, res) => { // Added res here
//   const tokens = req.signedCookies.sessionId;
//   if (!tokens) {
//     throw new Error('Authentication required. No tokens found in session.');
//   }

//   // **CRITICAL:** Check the contents of the sessionId cookie.
//   console.log('Session ID Cookie Contents:', tokens);

//   if (!tokens.access_token) {
//     throw new Error(
//       'Authentication required.  Access token is missing from session.'
//     );
//   }

//   try {
//     oAuth2Client.setCredentials(tokens);

//     if (oAuth2Client.isExpired()) {
//       console.log('Token is expired, trying to refresh');
//       const refreshedTokens = await oAuth2Client.refreshAccessToken();
//       if (refreshedTokens.credentials) {
//         oAuth2Client.setCredentials(refreshedTokens.credentials);
//         // **CRITICAL:** You MUST update the cookie with the refreshed tokens.
//         res.cookie('sessionId', refreshedTokens.credentials, { // Use the res object
//           signed: true,
//           httpOnly: true,
//           maxAge: 1000 * 60 * 60 * 24 * 7,
//         });
//         console.log('Token refreshed and cookie updated');
//       } else {
//         throw new Error('Failed to refresh access token');
//       }
//     }
//     return oAuth2Client;
//   } catch (error) {
//     console.error('Error getting/refreshing auth client', error);
//     throw new Error('Failed to authenticate: ' + error.message);
//   }
// };

// // Helper function to create a Google Doc with the content
// const createGoogleDoc = async (auth, content) => {
//   const docsClient = google.docs({ version: 'v1', auth });

//   try {
//     const document = await docsClient.documents.create({
//       requestBody: {
//         title: 'Generated Document',
//       },
//     });

//     const documentId = document.data.documentId;

//     await docsClient.documents.batchUpdate({
//       documentId,
//       requestBody: {
//         requests: [
//           {
//             insertText: {
//               location: { index: 1 },
//               text: content,
//             },
//           },
//         ],
//       },
//     });

//     return document.data;
//   } catch (error) {
//     console.error('Error creating/updating Google Doc:', error);
//     throw new Error('Failed to create/update document: ' + error.message);
//   }
// };

// const firPrompt = (description, language) => {
//   if (language === 'Hindi') {
//     return `आपके द्वारा दी गई सूचना के आधार पर यह एफआईआर ड्राफ्ट तैयार किया गया है। कृपया सुनिश्चित करें कि सभी विवरण सही हैं:\n${description}`;
//   }
//   return `Based on the information you provided, this FIR draft is generated. Please ensure all details are correct:\n${description}`;
// };

// const rtiPrompt = (description, language) => {
//   if (language === 'Hindi') {
//     return `आपके द्वारा दी गई सूचना के आधार पर यह आरटीआई ड्राफ्ट तैयार किया गया है। कृपया सुनिश्चित करें कि सभी विवरण सही हैं:\n${description}`;
//   }
//   return `Based on the information you provided, this RTI draft is generated. Please ensure all details are correct:\n${description}`;
// };

// export const generateDocument = asyncHandler(async (req, res) => {
//   const { type, description, language = 'English' } = req.body;

//   let prompt;
//   if (type === 'FIR') {
//     prompt = firPrompt(description, language);
//   } else if (type === 'RTI') {
//     prompt = rtiPrompt(description, language);
//   } else {
//     return res.status(400).json({ error: "Invalid type. Use 'FIR' or 'RTI'." });
//   }

//   try {
//     // Generate the content using Gemini AI
//     const result = await ai.models.generateContent({
//       model: 'gemini-2.0-flash',
//       contents: prompt,
//     });
//     console.log('Gemini Response:', result);

//     const response = result.response;
//     const output = response?.parts?.map((part) => part.text).join('').trim();

//     // Create the Google Doc and upload the content
//     const auth = await getAuthClient(req, res); // Pass res to getAuthClient
//     const createdDoc = await createGoogleDoc(auth, output);

//     // Get the document's URL
//     const docUrl = `https://docs.google.com/document/d/${createdDoc.documentId}/edit`;

//     res.status(200).json({
//       message: `${type} Draft created successfully.`,
//       docUrl,
//       draft: output,
//     });
//   } catch (err) {
//     console.error('Drafting error:', err);
//     res.status(500).json({ error: 'Failed to generate document: ' + err.message });
//   }
// });
