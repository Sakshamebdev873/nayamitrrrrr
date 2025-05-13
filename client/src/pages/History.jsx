import React, { useState, useEffect } from 'react';
import customFetch from '../utils/customFetch';
import { History, User, Bot, Trash2, RotateCw, ChevronRight, MessageSquare } from 'lucide-react';
import { useLoaderData, useNavigate, useParams, useRevalidator } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const loader = async ({ params }) => {
  try {
    const { id } = params;
    const { data } = await customFetch.get(`/history/${id}`);
    return data;
  } catch (error) {
    console.error("Loader error:", error);
    throw error;
  }
};

const renderMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/```([^`]+)```/g, '<pre class="bg-gray-800 text-white p-2 rounded-md overflow-x-auto"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
    .replace(/\n/g, '<br />');
};

const HHistory = () => {
  const initialData = useLoaderData();
  const [sessions, setSessions] = useState(initialData);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isContinuing, setIsContinuing] = useState(null);
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();
  const { id } = useParams();

  // Sync with loader data
  useEffect(() => {
    setSessions(initialData);
  }, [initialData]);

  const handleDeleteChat = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    
    setIsDeleting(sessionId);
    try {
      // Optimistic update
      setSessions(prev => ({
        ...prev,
        otherSessions: prev.otherSessions.filter(s => s.sessionId !== sessionId)
      }));

      // Server deletion
      const { data } = await customFetch.post(`/delete/${id}`, { sessionId });
      
      if (!data.success) throw new Error(data.message || "Deletion failed");

      // Dual validation
      await Promise.all([
        revalidate(),
        customFetch.get(`/history/${id}`).then(({ data }) => {
          setSessions(data);
        })
      ]);

      toast.success("Chat deleted successfully");
      if (selectedSessionId === sessionId) setSelectedSessionId(null);
    } catch (error) {
      // Revert on error
      const { data } = await customFetch.get(`/history/${id}`);
      setSessions(data);
      toast.error(error.message || "Failed to delete chat");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleContinueChat = async (sessionId) => {
    setIsContinuing(sessionId);
    try {
      const { data } = await customFetch.post('/change', { sessionId });
      console.log(data);
      
      if (data.msg) {
        navigate(`/chat/${id}`);
        toast.success("Chat session resumed");
      } else {
        throw new Error(data.message || "Failed to continue chat");
      }
    } catch (error) {
      toast.error(error.message || "Error continuing chat");
    } finally {
      setIsContinuing(null);
    }
  };

  const selectedSession = sessions.otherSessions.find(
    session => session.sessionId === selectedSessionId
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <History className="text-blue-600" size={20} />
          <h1 className="text-xl font-bold text-gray-800">Chat History</h1>
        </div>

        {sessions.otherSessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.otherSessions.map((session) => (
              <motion.div
                key={session.sessionId}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative group"
              >
                <button
                  onClick={() => setSelectedSessionId(session.sessionId)}
                  disabled={isDeleting === session.sessionId || isContinuing === session.sessionId}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${
                    selectedSessionId === session.sessionId
                      ? 'bg-blue-50 border-l-2 border-blue-500'
                      : 'hover:bg-gray-100'
                  } transition-colors ${
                    (isDeleting === session.sessionId || isContinuing === session.sessionId) 
                      ? 'opacity-70' : ''
                  }`}
                >
                  <span className="truncate text-sm font-medium">
                    {session.title || "Untitled Chat"}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  {(isDeleting === session.sessionId || isContinuing === session.sessionId) && (
                    <div className="absolute right-3">
                      <RotateCw className="animate-spin h-4 w-4 text-blue-500" />
                    </div>
                  )}
                </button>

                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContinueChat(session.sessionId);
                    }}
                    className="p-1 rounded-full bg-green-50 hover:bg-green-100 text-green-600"
                    title="Continue chat"
                    disabled={isContinuing === session.sessionId}
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(session.sessionId);
                    }}
                    className="p-1 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                    title="Delete chat"
                    disabled={isDeleting === session.sessionId}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No chat history found</p>
            <p className="text-sm mt-1">Start new chats to see them here</p>
          </div>
        )}
      </div>

      {/* Chat Viewer */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        {selectedSession ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSessionId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {selectedSession.title || "Chat Details"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedSession.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleContinueChat(selectedSessionId)}
                  disabled={isContinuing === selectedSessionId}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-70"
                >
                  {isContinuing === selectedSessionId ? (
                    <>
                      <RotateCw className="animate-spin h-4 w-4" />
                      Continuing...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={16} />
                      Continue Chat
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                {selectedSession.messages
                  .reduce((acc, msg, i, arr) => {
                    if (msg.role === "user" && arr[i+1]?.role === "assistant") {
                      acc.push({
                        prompt: msg.prompt,
                        response: arr[i+1].response
                      });
                    }
                    return acc;
                  }, [])
                  .map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-100 pb-6 last:border-0"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="text-blue-600" size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">User</p>
                          <p className="text-gray-700 mt-1">{msg.prompt}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Bot className="text-green-600" size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">Assistant</p>
                          <div
                            className="prose prose-sm mt-1 text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(msg.response)
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bot size={48} className="mb-4 text-gray-300" />
            <p className="text-lg">Select a chat from the sidebar</p>
            <p className="text-sm mt-1">or start a new conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HHistory;