import { useState } from 'react';
import customFetch from '../utils/customFetch'
import {Link, useNavigation} from 'react-router-dom'
import { Form } from 'react-router-dom';
export default function LegalRightsPage() {
  const questions = [
   "Do you know any two Fundamental Rights under the Indian Constitution?",
  "Have you faced discrimination by gender, caste, religion, or other? Briefly explain.",
  "Have you seen or experienced legal violations (e.g., domestic violence, harassment)? Describe.",
  "Do you know how to file an FIR? List the main steps.",
  "How familiar are you with IPC and CrPC? How do they protect citizens?"
  ];

  const [responses, setResponses] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);

  const handleChange = (key, value) => {
  setResponses(prev => ({ ...prev, [key]: value }));
};

  const toggleQuestion = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  const [result, setResult] = useState(null); // Holds backend response
const [submitting, setSubmitting] = useState(false); 
 const handleSubmit = async (e) => {
  e.preventDefault();

  const orderedResponses = Object.entries(responses)
    .filter(([key]) => key.startsWith("q"))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
setSubmitting(true);
  if (orderedResponses.length !== 5) {
    alert("Please answer all 5 questions before submitting.");
    return;
  }

  try {
    const { data } = await customFetch.post("/submitSurvey", {
      responses: orderedResponses,
    });

    // console.log("Server Response:", data);
    setResult(data); // Store result to display
  } catch (error) {
   setSubmitting(false);
    console.error("Submission error:", error);
  }finally {
      // Make sure to reset submitting state
      setSubmitting(false);
    }
};
const renderMarkdown = (text) => {
  const lines = text.split("\n");

  return lines.map((line, index) => {
    // Check if it's a list item (starts with '* ')
    const isListItem = /^\*\s+/.test(line);

    // Convert **bold** → <strong> and *italic* → <em>
    const htmlLine = line
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(?!\s)(.*?)(?!\s)\*/g, "<em>$1</em>"); // Italic (not matching the list asterisk)

    if (isListItem) {
      return (
        <li
          key={index}
          className="ml-4 list-disc text-sm text-gray-800"
          dangerouslySetInnerHTML={{
            __html: htmlLine.replace(/^\*\s+/, ""), // remove list asterisk
          }}
        />
      );
    }

    return (
      <p
        key={index}
        className="text-sm text-gray-800 mb-1"
        dangerouslySetInnerHTML={{ __html: htmlLine }}
      />
    );
  });
};




  return (
    <>
    <div className="min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-around items-center gap-x-5 mb-30">
        <div className="flex flex-col justify-end gap-y-3 ml-10">
          <h2 className="text-4xl font-bold mb-8 text-gray-800 drop-shadow-sm">Understand your legal right</h2>
          <p className="text-sm font-light max-w-[40%]">
            Our AI-powered survey helps you identify potential legal issues and provides personalized guidance on protecting your rights.
          </p>
        </div>
        <img
          src="https://plus.unsplash.com/premium_vector-1683141046588-e7d469b8d507?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="helper"
          className="max-w-[40%] mt-10 h-[40%] rounded-2xl"
        />
      </div>
   <Form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-4xl px-6 py-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
  <h3 className="text-3xl font-bold mb-8 text-blue-800 drop-shadow-sm text-center">
    Your Legal Awareness Survey
  </h3>

  <div className="space-y-6">
    {questions.map((question, index) => (
      <div
        key={index}
        className="border border-gray-200 rounded-2xl bg-gray-50 shadow-sm overflow-hidden transition-all duration-300"
      >
        <div
          className="flex justify-between items-center p-5 bg-white cursor-pointer hover:bg-blue-50"
          onClick={() => toggleQuestion(index)}
        >
          <h4 className="font-medium text-gray-900 text-lg">{question}</h4>
          <span className="text-gray-500 text-2xl font-bold">
            {activeIndex === index ? '−' : '+'}
          </span>
        </div>

        {activeIndex === index && (
          <div className="px-5 pb-5">
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your answer here..."
              value={responses[`q${index}`] || ""}
              onChange={(e) => handleChange(`q${index}`, e.target.value)}
              required
            />
          </div>
        )}
      </div>
    ))}
  </div>

  <div className="text-center">
    <button
      type="submit"
      disabled={submitting}
      className={`mt-10 inline-flex items-center justify-center px-8 py-3 text-white font-semibold rounded-xl transition duration-300 shadow-md ${
        submitting
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
      }`}
    >
      {submitting ? "Submitting Responses..." : "Submit Responses"}
    </button>
  </div>
</Form>
  {result && (
  <div className="animate-fadeIn bg-white rounded-3xl shadow-lg p-8 mt-12 max-w-4xl mx-auto border border-gray-100 transition-all duration-500">
    <h3 className="text-2xl font-bold mb-4 text-red-600 drop-shadow">
      {result.message}
    </h3>

    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
      {renderMarkdown(result.analysis)}
    </div>

    <div className="bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-500 mt-6 text-green-800 p-5 rounded-xl shadow-inner">
      <p className="font-semibold text-lg">{result.Suggestion !== "Please Let us help you" ? <Link to={'/signup'}>Let us help you by registering yourself</Link> : "You are in Right Environment" }</p>
    </div>
  </div>
)}
      {/* Legal Issues and Actions */}
      <div className="flex justify-around items-center mt-12 gap-x-5 mx-10 my-5">
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-2xl shadow-md text-gray-800 max-w-xl">
          <h4 className="text-xl font-semibold mb-2 text-red-600">Identified Legal Issues</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Possible lack of awareness about professional legal obligations.</li>
            <li>Unclear understanding of confidentiality and ethical compliance.</li>
            <li>Risk of non-compliance with sector-specific regulations.</li>
            <li>Vulnerability to legal consequences due to privilege misuse or ignorance.</li>
          </ul>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-2xl shadow-md text-gray-800 max-w-xl">
          <h4 className="text-xl font-semibold mb-2 text-green-700">Recommended Actions</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Review your profession’s code of ethics and compliance guidelines.</li>
            <li>Attend legal awareness workshops or online courses.</li>
            <li>Consult your sector's regulatory body for up-to-date rules.</li>
            <li>Document privileges and ensure fair, lawful usage.</li>
            <li>Stay updated on labor laws and digital rights (especially for tech roles).</li>
          </ul>
        </div>
      </div>

      {/* Interactive Q&A Form */}
  
    </div>


</>
  );
}
