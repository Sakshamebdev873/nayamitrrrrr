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
import { FaMicrophone } from "react-icons/fa";
import { LuMessageCirclePlus } from "react-icons/lu";
import customFetch from "../utils/customFetch";
import { toast } from "sonner";
export const action = async ({ request, params }) => {
  const { id } = params;
  const formdata = await request.formData();
  const data = Object.fromEntries(formdata);
  try {
    const res = await customFetch.post(`/create/${id}`, data);
    const { msg } = res.data;
    return msg;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const loader = async ({ params }) => {
  try {
    const { id } = params;
    const { data } = await customFetch.get(`/history/${id}`);
    // console.log(data);
    
    return {
      currentSession: data?.currentSession || null,
    };
  } catch (error) {
    console.log(error);
    return redirect("/login");
  }
};

// Basic custom markdown parser for basic formatting
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
      isOrdered = false;
      listItems.push(line.replace(/^[-*] /, ""));
    } else if (/^\d+\. /.test(line)) {
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
  const {id} = useParams()
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(currentSession?.messages || []);
  const [recognizing, setRecognizing] = useState(false);

  useEffect(() => {
    setMessages(currentSession?.messages || []);
  }, [currentSession]);


  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Voice recognition logic
  const [inputText, setInputText] = useState("");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  
  const handleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setRecognizing(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript); // ✅ sets input field
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Speech recognition error: " + event.error);
      setRecognizing(false);
    };

    recognition.onend = () => {
      setRecognizing(false);
    };
    recognition.start();
  };
  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setRecognizing(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && inputRef.current) {
        inputRef.current.value = transcript;
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Speech recognition error: " + event.error);
    };

    recognition.onend = () => {
      setRecognizing(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const prompt = formData.get("prompt");
    if (!prompt.trim()) return;

    const userMessage = {
      role: "user",
      prompt,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    submit(formRef.current, { method: "post" });

    try {
      const res = await customFetch.post(`/create/${currentSession?.userId}`, {
        prompt,
      });
      const responseMessage = {
        role: "assistant",
        response: res.data.response,
      };
      setMessages((prev) => [...prev, responseMessage]);
      formRef.current.reset();
      inputRef.current.value = "";
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      formRef.current.reset();
    }
  };

  const Sidebardata = [
  
    {
      img: "/assist.png",
      text: "Legal Assistant",
      path: "/",
    },
    {
      img: "/docu.png",
      text: "Document Analyser",
      path: "/analyst",
    },
    {
      img: "/docu.png",
      text: "Roots",
      path: "/root",
    },
    {
      img: "/docu.png",
      text: "Generate Documents",
      path: "/legalAssistance",
    },
    {
      img: "/w2.png",
      text: "Cyber Information",
      path: "/cybersection",
    },
    {
      img: "/history (1).png",
      text: "History",
      path: `/history/${id}`,
    },
    {
      img: "/heart.png",
      text: "Safety hub",
      path: "/safetyhub",
    },
    {
      img: "/laws.png",
      text: "State Wise Laws",
      path: "/lawforstate",
    },
  
    {
      img: "/w1.png",
      text: "Survey",
      path: "/survey",
    },
    {
      img: "/n1.png",
      text: "Case Analysis",
      path: "/dashboard",
    },{
      img: '/n1.png',
      text : "Case Helper",
      path : `/caseHelper/${id}`
    }
  ];

  const handleLogout = async () => {
    try {
      await customFetch.get("/logout");
      toast.success("Successfully logged Out....");
      return navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewChat = async () => {
  try {
    // 1. Clear current messages immediately
    setMessages([]);
    
    // 2. Call API to create new session
    await customFetch.get(`/new/${id}`);
    
    // 3. Optionally refetch current session data
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
      <h1 className="text-[20px] font-semibold text-white">Nayay Mitra</h1>

      <button type="button" onClick={handleNewChat} label='new chat' title="New Chat" className=" bg-[#3c32b5] text-yellow-300 ml-3 hover:scale-105 transition-all duration-300 p-1 text-2xl" >
      <LuMessageCirclePlus className=""/></button>
    </div>
    <div className="flex flex-col flex-1 overflow-y-auto text-white">
      {Sidebardata.map((item, index) => {
        const { img, text, path } = item;
        const isResourceHeader = index === 5;
const isCase = index === 9;
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
              className={() =>
                `flex gap-4 py-3.5 px-6 ${
                  index === 0 
                    ? "text-yellow-400 bg-white/10  mt-2 rounded-lg"
                    : "text-white mt-2 "
                }`
              }
            >
              <img src={img} alt={text} className="w-[18px] h-[16px] text-white/100"/>
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
    <div className="flex justify-between items-center h-[77px] bg-[#4338CA] px-4">
      <div className="flex items-center">
        <div className="w-[55px] h-[45px] rounded-2xl flex justify-center items-center bg-white">
          <img src="/Frame.png" alt="icon" className="w-[41px] h-[36px] text-white" />
        </div>
        <h1 className="text-white text-[20px] font-normal ml-4">
          Legal Assistant
        </h1>
        
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 hover:scale-105 transition-all duration-500 hover:bg-red-400 text-white rounded-[8px] shadow-2xl"
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
            className={`max-w-[75%] p-4 rounded-lg shadow whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-white self-end ml-auto border border-gray-300"
                : "bg-[#E0E7FF] self-start mr-auto"
            }`}
          >
            {msg.role === "user" ? (
              <p className="text-sm">{msg.prompt}</p>
            ) : (
              <div>{renderMarkdown(msg.response)}</div>
            )}
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
  <div className="flex items-center gap-2 mt-10 text-center">
    <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
    <p className="text-sm text-gray-500">Thinking...</p>
  </div>
)}


      <div ref={messagesEndRef} />
    </div>

    {/* Chat input bar */}
    <div className="p-4 bg-white border-t border-gray-200">
      <form
        ref={formRef}
        method="post"
        className="flex gap-4 max-w-4xl mx-auto"
        onSubmit={handleSubmit}
      >
        {/* Voice input button */}
        <button
          type="button"
          onClick={startVoiceRecognition}
          className={`px-3 rounded-md cursor-pointer border ${
            recognizing ? "bg-gray-100 font-extrabold " : "bg-gray-100"
          } border-gray-300`}
          title="Click to speak"
        >
          <FaMicrophone />
        </button>

        <input
          type="text"
          name="prompt"
          ref={inputRef}
          placeholder={
            navigation.state === "submitting" ? "Please wait..." : "Ask anything..."
          }
          className="flex-1 px-4 h-[40px] border border-[#E5E7EB] shadow rounded-[8px] outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#4F46E5] cursor-pointer text-white px-6 h-[40px] hover:scale-104 transition-all duration-500 rounded-[8px]"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</div>

  );
};

export default Chat;
