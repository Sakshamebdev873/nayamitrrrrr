import React, { useState } from 'react';
import customFetch from '../utils/customFetch';
import { History, User, Bot } from 'lucide-react';
import { useLoaderData, redirect, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const loader = async ({ params }) => {
  try {
    const { id } = params;
    const { data } = await customFetch.get(`/history/${id}`);
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return redirect("/login");
  }
};

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/```([^`]+)```/g, '<pre class="bg-gray-800 text-white p-2 rounded-md overflow-x-auto"><code>$1</code></pre>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br />');
}
const HHistory = () => {
const data = useLoaderData();
  const [sessions, setSessions] = useState(data);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isContinuing, setIsContinuing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const selectedSession = sessions.otherSessions.find(
    (session) => session.sessionId === selectedSessionId
  );

  const handleDeleteChat = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      const { data } = await customFetch.post(`/delete/${id}`, {
        sessionId
      });

      if (data.success) {
        setSelectedSessionId(null);
        setSessions({
          currentSession: null,
          otherSessions: sessions.otherSessions.filter(s => s.sessionId !== sessionId)
        });
      } else {
        alert(data.message || "Failed to delete chat");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting chat. Please try again.");
    }
  };
const handleContinueChat = async (sessionId) => {
    try {
      setIsContinuing(true);
      
      // 1. Update the session cookie
      const { data } = await customFetch.post('/change', {
        sessionId
      });
      
      if (data.sessionId) {
        // 2. Redirect to chat interface
        navigate(`/chat/${id}`); // Adjust to your chat route
      } else {
        console.error('Failed to continue chat:', data);
        alert('Failed to continue chat. Please try again.');
      }
    } catch (error) {
      console.error('Error continuing chat:', error);
      alert('An error occurred while continuing the chat.');
    } finally {
      setIsContinuing(false);
    }
  };


  // Update your Continue Chat button:
  const ContinueChatButton = ({ sessionId }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleContinueChat(sessionId);
      }}
      disabled={isContinuing}
      className={`text-xs px-2 py-1 ${
        isContinuing 
          ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
          : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
      } rounded shadow flex items-center gap-1`}
    >
      {isContinuing ? (
        <>
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Continuing...
        </>
      ) : (
        <>➤ Continue Chat</>
      )}
    </button>
  );
  return (
  <div className="flex h-screen overflow-hidden">
  {/* Sidebar */}
  <div className="shadow-xl bg-gray-100 h-full rounded-r-2xl w-[20vw] p-4 overflow-y-auto">
    <h1 className="text-xl font-semibold text-black mb-3">Conversations</h1>
    <h2 className="text-sm flex items-center gap-2 text-gray-700 mb-4">
      <History size={16} /> Previous Conversations
    </h2>

    <div className="flex flex-col gap-2">
 {data.otherSessions.length > 0 ? (
  data.otherSessions.map((session) => {
    const isActive = selectedSessionId === session.sessionId;

    return (
      <div key={session.sessionId} className="relative group w-full">
        {/* Title Button */}
        <button
          onClick={() => setSelectedSessionId(session.sessionId)}
          className={`w-full text-left px-3 py-2 rounded-lg border text-sm shadow-sm flex flex-col items-start ${
            isActive
              ? 'bg-blue-100 border-blue-500 border-l-4 font-semibold text-blue-800'
              : 'bg-white border-gray-300 hover:bg-blue-50'
          }`}
        >
          {session.title.split('\n').map((line, idx) => (
            <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </button>

        {/* Hover Buttons OUTSIDE the box */}
        <div className="flex gap-2 pt-2 pl-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <ContinueChatButton sessionId={session.sessionId} />
          <button
            onClick={(e) => {
              e.stopPropagation();
             handleDeleteChat(session.sessionId);
            }}
            className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded shadow"
          >
            🗑 Delete Chat
          </button>
        </div>
      </div>
    );
  })
  ) : (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded text-sm">
      <strong>No previous sessions found.</strong><br />
      This section only shows your past conversation history.
    </div>
  )}
</div>

  </div>

  {/* Chat Viewer */}
  <div className="bg-white text-black h-full rounded-l-2xl w-[80vw] p-6 overflow-y-auto shadow-lg">
    {selectedSession &&
  (() => {
    const pairedMessages = [];
    const messages = selectedSession.messages;

    for (let i = 0; i < messages.length - 1; i++) {
      const userMsg = messages[i];
      const assistantMsg = messages[i + 1];

      if (
        userMsg.role === "user" &&
        assistantMsg.role === "assistant" &&
        userMsg.prompt?.trim() &&
        assistantMsg.response?.trim()
      ) {
        pairedMessages.push({
          prompt: userMsg.prompt,
          response: assistantMsg.response,
        });
        i++; // Skip next because it's already paired
      }
    }

    return (
      <AnimatePresence>
        {pairedMessages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-6 bg-gray-100 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 text-blue-700 font-semibold mb-1">
              <User size={16} /> User:
            </div>
            <p className="mb-3 text-gray-800 text-sm">{msg.prompt}</p>

            <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
              <Bot size={16} /> Assistant:
            </div>
            <div
              className="text-gray-800 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(msg.response),
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    );
  })()}

  </div>
</div>

  );
};

export default HHistory;
