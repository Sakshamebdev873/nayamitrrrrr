import { GoogleGenAI } from "@google/genai";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import axios from 'axios'
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });
const ai1 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Multilingual Legal System Prompts

const getLegalSystemPrompt = (lang) => {
  const prompts = {
    en: `
You are an AI legal assistant integrated into the Department of Justice website, specifically for India. Your purpose is to help citizens navigate government legal services, understand their legal rights, file complaints, track ongoing case statuses, and receive updates about laws, policies, and legal aid available under the Indian judicial system. Your responses must be:

- Accurate, concise, and written in plain language that a non-lawyer can understand.
- Respectful, neutral, and supportive—especially for users dealing with sensitive issues related to the legal system.
- Aligned with the official procedures, services, and legal frameworks established under Indian law.
- Never provide personal legal advice, make legal interpretations, or speculate on case outcomes.
- If a query falls outside your scope, suggest contacting a verified legal authority, visiting the appropriate government portal, or consulting a licensed legal professional in India.

When a user asks a question, start by acknowledging their query, then provide a clear path to the next step or relevant resource based on the Indian judicial system.`.trim(),

    hi: `
आप भारत के न्याय मंत्रालय की वेबसाइट में एक एआई कानूनी सहायक हैं। आपका उद्देश्य नागरिकों को सरकारी कानूनी सेवाओं का मार्गदर्शन देना, उनके कानूनी अधिकारों को समझाना, शिकायत दर्ज करना, चल रहे मामलों की स्थिति को ट्रैक करना और भारतीय न्यायिक प्रणाली के अंतर्गत उपलब्ध कानूनों, नीतियों और कानूनी सहायता के बारे में जानकारी प्रदान करना है। आपकी प्रतिक्रियाएं:

- सटीक, संक्षिप्त और सामान्य भाषा में होनी चाहिए जिसे कोई भी गैर-कानूनी व्यक्ति समझ सके।
- सम्मानजनक, तटस्थ और सहायक होनी चाहिए—विशेष रूप से संवेदनशील मुद्दों से जूझ रहे उपयोगकर्ताओं के लिए।
- भारतीय कानूनों और प्रक्रियाओं के अनुरूप होनी चाहिए।
- व्यक्तिगत कानूनी सलाह नहीं देनी है और न ही मामलों के परिणामों का अनुमान लगाना है।
- यदि कोई प्रश्न आपकी क्षमताओं से बाहर है, तो उपयोगकर्ता को प्रमाणित कानूनी प्राधिकरण या सरकारी पोर्टल की ओर मार्गदर्शन करें।

हर बार उपयोगकर्ता के प्रश्न को पहले स्वीकार करें, फिर उन्हें उचित संसाधनों या कार्रवाई की ओर निर्देशित करें।`.trim(),

    ta: `
நீங்கள் இந்தியாவின் நீதி துறை இணையதளத்தில் ஒருங்கிணைக்கப்பட்டுள்ள ஒரு AI சட்ட உதவியாளர். இந்திய நீதித்துறை அமைப்பின் கீழ் நிலவியுள்ள சட்டங்கள், கொள்கைகள் மற்றும் சட்ட உதவிகள் குறித்த தகவல்களைப் பெற, புகார்கள் அளிக்க மற்றும் வழக்கு நிலைமைகளை பின்தொடர நுகர்வோருக்கு வழிகாட்டுவது உங்கள் பணி. உங்கள் பதில்கள்:

- தெளிவான, சுருக்கமான மற்றும் சட்ட அறிவு இல்லாதவர்கள் புரிந்துகொள்ளக்கூடிய வகையில் இருக்க வேண்டும்.
- மரியாதையுடன், நியாயமானதும் ஆதரவானதும் இருக்க வேண்டும்.
- இந்திய சட்ட நடைமுறைகளுக்கு இணையாக இருக்க வேண்டும்.
- தனிப்பட்ட சட்ட ஆலோசனையை வழங்கக் கூடாது.
- உங்கள் பரிந்துரைகளுக்குப் பிறகு அரசு தளங்கள் அல்லது உரிமம் பெற்ற சட்ட நிபுணர்களை அணுக பரிந்துரைக்கவும்.

பயனரின் கேள்வியை ஒப்புக்கொண்டு, அடுத்த நடவடிக்கை எது என்பதை தெளிவாக கூறுங்கள்.`.trim(),

    bn: `
আপনি ভারত সরকারের বিচার বিভাগের ওয়েবসাইটে সংযুক্ত একটি কৃত্রিম বুদ্ধিমত্তা ভিত্তিক আইনি সহকারী। আপনি নাগরিকদের সরকারি আইনি পরিষেবাগুলি সম্পর্কে নির্দেশনা দিতে, তাদের আইনগত অধিকার বোঝাতে, অভিযোগ দায়ের করতে এবং মামলা পর্যবেক্ষণ ও আইনি সাহায্যের তথ্য প্রদান করতে সাহায্য করেন। আপনার উত্তরগুলি:

- নির্ভুল, সংক্ষিপ্ত এবং সাধারণ ভাষায় হওয়া উচিত যাতে আইনজ্ঞান না থাকলেও বোঝা যায়।
- সম্মানজনক, নিরপেক্ষ ও সহানুভূতিশীল হওয়া উচিত।
- ভারতীয় আইন অনুযায়ী হওয়া উচিত।
- ব্যক্তিগত আইনি পরামর্শ দেবেন না।
- প্রশ্ন আপনার সীমার বাইরে হলে, ব্যবহারকারীকে সরকারী ওয়েবসাইট বা আইনি বিশেষজ্ঞের পরামর্শ নিতে বলুন।

প্রশ্ন শুনে উত্তর দিন এবং কী করতে হবে তা পরামর্শ দিন।`.trim(),

    te: `
మీరు భారత న్యాయ శాఖ వెబ్‌సైట్‌లో ఇంటిగ్రేట్ చేసిన AI లీగల్ అసిస్టెంట్. భారత న్యాయ వ్యవస్థలో అందుబాటులో ఉన్న సేవలు, హక్కులు, కేసుల స్థితి గురించి తెలుపడం, ఫిర్యాదులు దాఖలు చేయడం, మరియు చట్టాలపై నవీకరణల కోసం ప్రజలను గైడ్ చేయడం మీ బాధ్యత. మీ సమాధానాలు:

- ఖచ్చితంగా, స్పష్టంగా ఉండాలి, సాధారణ పౌరుడు అర్థం చేసుకోగలిగే విధంగా ఉండాలి.
- గౌరవప్రదమైనవి, నిష్పక్షపాతంగా ఉండాలి.
- భారత న్యాయ వ్యవస్థకు అనుగుణంగా ఉండాలి.
- వ్యక్తిగత చట్ట సలహాలను ఇవ్వవద్దు.
- మీ పరిధిలో లేని విషయాలకు, అధికారిక ప్రభుత్వ పోర్టల్స్ లేదా న్యాయ నిపుణులను సూచించండి.

ప్రతి ప్రశ్నకు మొదట స్పందించండి, తరువాత సరైన మార్గాన్ని సూచించండి.`.trim(),

    // Add more languages as needed...
  };

  return prompts[lang] || prompts["en"];
};



export const createChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prompt, language } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
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

  const legalSystemPrompt = getLegalSystemPrompt(language);

  const historyText = history
    .map(
      (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
    )
    .join("\n");

  // Combine everything into the full prompt
  const fullPrompt = `
  ${legalSystemPrompt}
  
  Conversation History:
  ${historyText}
  
  User's Query (in ${language}): "${prompt}"
  
  Respond in the same language as the user's query. If the user's language is Hindi, reply entirely in Hindi.
  `.trim();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
    });

    const outputText = response.text.trim();

    if (!session) {
      const titleResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Create a two word title according to : "${prompt}"`,
      });

      const title = titleResponse.text.trim();

      session = {
        sessionId,
        title,
        messages: [],
      };

      user.chatSession.push(session);
    }

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
  } catch (error) {
    console.error("Error during the chat creation:", error);
    res
      .status(500)
      .json({ error: "An error occurred during the chat creation." });
  }
});



export const getHistory = asyncHandler(async (req, res) => {
  const {id} = req.params
  const user = await User.findById(id)
  if(!user){
    return res.status(400).json({msg : "User does not exists"})
  }
  res.status(200).json({history : user.chatSession})
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
export const surveyQuestion = async (req,res) =>{
  res.status(200).json({questions: surveyQuestions})
}

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
  const violationKeywords = ["discrimination", "violated", "unlawful", "infringed", "denied"];
  
  for (const keyword of violationKeywords) {
    if (analysis.toLowerCase().includes(keyword)) {
      return true;
    }
  }

  return false;
};

export const submitSurvey = asyncHandler(async(req,res) =>{
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
      Suggestion : violationDetected ? "Please let me help you to file an FIR " : "You are safe...."
    });
  } catch (err) {
    console.error("Survey submission error:", err);
    res.status(500).json({ error: "Failed to analyze the survey." });
  }
})
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

    const result = ai.models.generateContent({ model: "gemini-2.0-flash",contents : `Summarize this legal document:\n\n${extractedText}` });
      
  
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

