import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  useLoaderData,
  useNavigation,
  redirect,
  useSubmit,
  NavLink,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Mic, MicOff } from "lucide-react";
import { LuMessageCirclePlus } from "react-icons/lu";
import customFetch from "../utils/customFetch"; // Assuming this is your configured axios instance
import { toast } from "sonner";

// This function handles the form submission on the server-side
export const action = async ({ request, params }) => {
  const { id } = params;
  const formdata = await request.formData();
  const data = Object.fromEntries(formdata);
  try {
    // This POST request sends the user's prompt to the backend
    const res = await customFetch.post(`/create/${id}`, data);
    const { msg } = res.data;
    return msg; // The action returns a response, triggering a re-render
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg || "An error occurred");
    return error;
  }
};

// This function loads the initial data for the component
export const loader = async ({ params }) => {
  try {
    const { id } = params;
    const { data } = await customFetch.get(`/history/${id}`);
    return {
      currentSession: data?.currentSession || null,
    };
  } catch (error) {
    console.log(error);
    // Redirect to login if fetching history fails (e.g., unauthorized)
    return redirect("/login");
  }
};

// A utility function to render markdown text to React elements
const renderMarkdown = (text) => {
  const lines = text.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeLines = [];
  let listItems = [];
  let isOrdered = false;

  const parseInline = (line) => {
    line = line.replace(
      /\*\*(.*?)\*\*/g,
      (_, match) => `<strong>${match}</strong>`
    );
    return line.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {match[1]}
          </a>
        );
      } else {
        return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
      }
    });
  };

  const flushList = () => {
    if (listItems.length > 0) {
      const ListTag = isOrdered ? "ol" : "ul";
      elements.push(
        <ListTag
          key={`list-${elements.length}`}
          className={`${
            isOrdered ? "list-decimal" : "list-disc"
          } pl-6 space-y-2 mt-4 mb-4 text-gray-800`}
        >
          {listItems.map((item, i) => (
            <li key={i} className="leading-snug mt-2 mb-2">
              {parseInline(item)}
            </li>
          ))}
        </ListTag>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.startsWith("```")) {
      flushList();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLines = [];
      } else {
        inCodeBlock = false;
        elements.push(
          <pre
            key={`code-${i}`}
            className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto my-4 text-sm font-mono"
          >
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (/^### /.test(line)) {
      flushList();
      elements.push(
        <h3
          key={i}
          className="text-lg font-medium text-gray-800 mt-4 mb-3 leading-snug"
        >
          <strong>{line.replace(/^### /, "")}</strong>
        </h3>
      );
    } else if (/^## /.test(line)) {
      flushList();
      elements.push(
        <h2
          key={i}
          className="text-xl font-semibold text-gray-800 mt-6 mb-4 leading-tight"
        >
          <strong>{line.replace(/^## /, "")}</strong>
        </h2>
      );
    } else if (/^# /.test(line)) {
      flushList();
      elements.push(
        <h1
          key={i}
          className="text-2xl font-bold text-gray-800 mt-8 mb-6 leading-tight"
        >
          <strong>{line.replace(/^# /, "")}</strong>
        </h1>
      );
    } else if (/^[-*] /.test(line)) {
      if (isOrdered) flushList();
      isOrdered = false;
      listItems.push(line.replace(/^[-*] /, ""));
    } else if (/^\d+\. /.test(line)) {
      if (!isOrdered) flushList();
      isOrdered = true;
      listItems.push(line.replace(/^\d+\. /, ""));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={i} className="text-gray-700 mt-2 mb-2 leading-relaxed">
          {parseInline(line)}
        </p>
      );
    }
  }

  flushList();

  return elements;
};

const Chat = () => {
  const { currentSession } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const formRef = useRef();
  const inputRef = useRef();
  const { id } = useParams();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState(currentSession?.messages || []);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // Update messages when loader data changes (e.g., on navigation)
  useEffect(() => {
    setMessages(currentSession?.messages || []);
  }, [currentSession]);

  // Scroll to the bottom of the chat on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      if (inputRef.current) {
        inputRef.current.value = finalTranscript + interimTranscript;
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        toast.error("Speech recognition error: " + event.error);
      }
      stopVoiceRecognition();
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  // --- NEW HANDLE SUBMIT FUNCTION ---
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const prompt = formData.get("prompt");

    // Prevent submission of empty messages
    if (!prompt?.trim()) {
      return;
    }

    // 1. Optimistically update the UI with the user's message
    const userMessage = { role: "user", prompt };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // 2. Programmatically submit the form to the React Router action
    submit(event.currentTarget, { method: "post" });

    // 3. Reset the form to clear the input field
    formRef.current.reset();
  };

  const Sidebardata = [
    { img: "/assist.png", text: "Legal Assistant", path: "/" },
    { img: "/docu.png", text: "Document Simplifier", path: "/analyst" },
    { img: "/brain2.png", text: "Roots", path: "/root" },
    { img: "/docu.png", text: "Draft FIR/RTI", path: "/legalAssistance" },
    { img: "/w2.png", text: "Cyber Section", path: "/cybersection" },
    { img: "/history (1).png", text: "Recent Chats", path: `/history/${id}`},
    { img: "/laws.png", text: "State Wise Laws", path: "/lawforstate" },
    { img: "/w1.png", text: "Survey", path: "/survey" },
    { img: "/n1.png", text: "Case Analysis", path: "/dashboard" },
    { img: '/case2.png', text: "Case Helper", path: `/caseHelper/${id}` },
    { img: '/history (1).png', text: "Case History", path: `/caseHistory/${id}`}
  ];

  const handleLogout = async () => {
    try {
      await customFetch.get("/logout");
      toast.success("Successfully logged Out....");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Logout failed.");
    }
  };

  const handleNewChat = async () => {
    try {
      setMessages([]);
      await customFetch.get(`/new/${id}`);
      // After creating a new session, refetch history to update UI
      const { data } = await customFetch.get(`/history/${id}`);
      setMessages(data?.currentSession?.messages || []);
      toast.success("New chat session created");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create new session");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden ">
      {/* Sidebar */}
      <div className="w-[20vw] h-full bg-[#3c32b5] flex-shrink-0 flex flex-col">
        <div className="h-[77px] border-b border-gray-200 flex justify-center items-center gap-4">
          <img src="/chat.png" alt="chat" className="w-[30px] h-[24px]" />
          <h1 className="text-[20px] font-semibold text-white">Nyay Mitra</h1>
          <button
            type="button"
            onClick={handleNewChat}
            className="bg-[#3c32b5] text-yellow-300 ml-3 hover:scale-105 transition-all duration-300 p-1 text-2xl"
          >
            <LuMessageCirclePlus />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto text-white">
          {Sidebardata.map((item, index) => {
            const { img, text, path } = item;
            const isResourceHeader = index === 6;
            const isCase = index === 9; // Adjusted index for Case
            return (
              <div key={index}>
                {isResourceHeader && (
                  <h1 className="px-4 font-normal text-[14px] leading-[100%] text-[#FFFFFF99] mt-4">
                    Resources
                  </h1>
                )}
                {isCase && (
                  <h1 className="px-4 font-normal text-[14px] leading-[100%] text-[#FFFFFF99] mt-4">
                    Case
                  </h1>
                )}
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex gap-4 py-3.5 px-6 mt-2 ${
                      isActive
                        ? "text-yellow-400 bg-white/10 rounded-lg"
                        : "text-white"
                    }`
                  }
                >
                  <img src={img} alt={text} className="w-[18px] h-[16px] text-white/100" />
                  <p className="font-normal text-[14px] leading-[14px]">
                    {text}
                  </p>
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <div className="flex justify-between items-center h-[77px] bg-[#4338CA] px-4 shadow-md">
          <div className="flex items-center">
            <div className="w-[55px] h-[45px] rounded-2xl flex justify-center items-center bg-white">
              <img src="/Frame.png" alt="icon" className="w-[41px] h-[36px]" />
            </div>
            <h1 className="text-white text-[20px] font-normal ml-4">
              Legal Assistant
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-red-500 text-white rounded-[8px] shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Chat content area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-lg shadow whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-white border border-gray-300"
                      : "bg-[#E0E7FF]"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm text-gray-800">{msg.prompt}</p>
                  ) : (
                    <div>{renderMarkdown(msg.response)}</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <div className="text-5xl mb-4">⚖️</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                How can I help you with laws today?
              </h2>
              <p className="text-sm text-gray-500 max-w-md">
                Ask about <span className="font-medium text-blue-500">RTI drafting</span>,
                <span className="font-medium text-green-500"> FIR generation</span>, or
                <span className="font-medium text-purple-500"> legal advice</span>.
              </p>
            </div>
          )}
          {navigation.state === "submitting" && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-4 rounded-lg shadow bg-[#E0E7FF] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input bar */}
        <div className="p-4 bg-white border-t border-gray-200">
          {/* --- MODIFIED: Added onSubmit to the Form --- */}
          <Form
            ref={formRef}
            method="post"
            onSubmit={handleSubmit}
            className="flex gap-4 max-w-4xl mx-auto"
          >
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-3 rounded-md cursor-pointer border ${
                isRecording
                  ? "bg-red-100 text-red-600 border-red-300"
                  : "bg-gray-100 border-gray-300"
              } flex items-center justify-center transition-colors duration-200`}
              title={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            <input
              type="text"
              name="prompt"
              ref={inputRef}
              placeholder={
                navigation.state === "submitting" ? "Nyay Mitra is thinking..." : "Ask anything..."
              }
              className="flex-1 px-4 h-[44px] border border-[#E5E7EB] shadow-sm rounded-[8px] outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={navigation.state === "submitting"}
            />
            <button
              type="submit"
              disabled={navigation.state === "submitting"}
              className="bg-[#4F46E5] cursor-pointer text-white px-6 h-[44px] hover:bg-indigo-700 transition-all duration-300 rounded-[8px] disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Chat;