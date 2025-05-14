import { useState } from 'react';
import customFetch from '../utils/customFetch';
import {Link, useNavigation} from 'react-router-dom';
import { Form } from 'react-router-dom';

export default function LegalRightsPage() {
  const questions = [
    "Do you know any two Fundamental Rights under the Indian Constitution?",
    "Have you faced discrimination by gender, caste, religion, or other? Briefly explain.",
    "Have you seen or experienced legal violations (e.g., domestic violence, harassment)? Describe.",
    "Do you know how to file an FIR? List the main steps.",
    "How familiar are you with BNS and BNSS? How do they protect citizens?"
  ];

  const [responses, setResponses] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key, value) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const toggleQuestion = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderedResponses = Object.entries(responses)
      .filter(([key]) => key.startsWith("q"))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);

    if (orderedResponses.length !== 5) {
      alert("Please answer all 5 questions before submitting.");
      setSubmitting(false);
      return;
    }

    try {
      const { data } = await customFetch.post("/submitSurvey", {
        responses: orderedResponses,
      });
      setResult(data);
    } catch (error) {
      console.error("Submission error:", error);
      setResult({
        error: "Analysis failed",
        fallbackHelpline: "National Commission for Women: 7827-170-170",
        suggestion: "Please try again or contact the helpline directly"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, i) => {
      if (line.startsWith('•')) {
        return <li key={i} className="ml-4 list-disc">{line.substring(1).trim()}</li>;
      }
      return <p key={i} className="mb-2">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-around items-center gap-x-5 mb-30">
        <div className="flex flex-col justify-end gap-y-3 ml-10">
          <h2 className="text-4xl font-bold mb-8 text-gray-800 drop-shadow-sm">
            Understand your legal rights
          </h2>
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
            {submitting ? "Analyzing Responses..." : "Submit Responses"}
          </button>
        </div>
      </Form>

      {result && (
        <div className="animate-fadeIn bg-white rounded-3xl shadow-lg p-8 mt-12 max-w-4xl mx-auto border border-gray-100 transition-all duration-500">
          {result.error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-red-700 mb-2">Error</h3>
              <p className="text-red-600">{result.error}</p>
              <p className="mt-2 text-gray-700">
                <strong>Helpline:</strong> {result.fallbackHelpline}
              </p>
              <p className="text-gray-700">{result.suggestion}</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-4 text-blue-800">
                Survey Results
              </h3>

              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">Summary:</h4>
                <p className="text-gray-700">{result.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Helpline:</h4>
                  <p className="text-blue-700">{result.helpline}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Next Step:</h4>
                  <p className="text-green-700">{result.nextStep}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Awareness Percentage:</h4>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full ${
                      result.awarenessPercentage >= 70 ? 'bg-red-500' :
                      result.awarenessPercentage >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${100 - result.awarenessPercentage}%` }}
                  ></div>
                </div>
                <p className="text-right mt-1 text-sm text-gray-600">
                  {100 - result.awarenessPercentage}% of Awareness Detected
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Reasoning:</h4>
                <div className="text-gray-700">
                  {renderMarkdown(result.reasoning)}
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">NyayaMitr Prompt:</h4>
                <div className="bg-white p-3 rounded border border-purple-200">
                  <code className="text-purple-700">{result.nyayaPrompt}</code>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Copy and paste this into NyayaMitr for detailed guidance
                </p>
              </div>

              <div className="mt-6 bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-500 p-5 rounded-xl">
                <h4 className="font-semibold text-lg mb-2">Recommendation:</h4>
                <p className="text-green-800">{renderMarkdown(result.fullAnalysis)}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Legal Resources Section */}
      <div className="flex justify-around items-center mt-12 gap-x-5 mx-10 my-5">
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-2xl shadow-md text-gray-800 max-w-xl">
          <h4 className="text-xl font-semibold mb-2 text-red-600">Common Legal Issues</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Discrimination based on gender, caste, or religion</li>
            <li>Domestic violence and harassment cases</li>
            <li>Unlawful detention or police misconduct</li>
            <li>Property and inheritance disputes</li>
          </ul>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-2xl shadow-md text-gray-800 max-w-xl">
          <h4 className="text-xl font-semibold mb-2 text-green-700">Legal Resources</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>National Legal Services Authority (NALSA): 15100</li>
            <li>National Commission for Women: 7827-170-170</li>
            <li>National Human Rights Commission: 1800-123-456</li>
            <li>State Legal Services Authorities (SLSA)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}