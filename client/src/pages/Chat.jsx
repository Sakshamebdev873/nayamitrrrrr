import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  useLoaderData,
  useNavigation,
  redirect,
  useSubmit,
  NavLink,
  useNavigate,
} from "react-router-dom";
import customFetch from "../utils/customFetch";

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
const navigate = useNavigate()
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
      img: "/home.png",
      text: "Home",
      path: "/",
    },
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
      text: "Generate Documents",
      path: "/legalAssistance",
    },
    {
      img: "/heart.png",
      text: "Safety hub",
      path: "/",
    },
    {
      img: "/laws.png",
      text: "State Wise Laws",
      path: "/lawforstate",
    },
    {
      img: "/heart.png",
      text: "Cyber Information",
      path: "/cybersection",
    },
    {
      img: "/heart.png",
      text: "Case Analysis",
      path: "/dashboard",
    },
  ];

  const handleLogout = async () => {
    try {
      await customFetch.get("/logout");

      return navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-[350px] h-screen bg-[#3c32b5]">
        <div className="h-[77px] border-b border-gray-200 flex justify-center items-center gap-4">
          <img src="/chat.png" alt="chat" className="w-[30px] h-[24px]" />
          <h1 className="text-[20px] font-semibold text-white">Nayay Mitra</h1>
        </div>
        <div className="flex flex-col">
          {Sidebardata.map((item, index) => {
            const { img, text, path } = item;
            return (
              <>
                {index === 5 ? (
                  <div key={index} className="flex flex-col gap-2">
                    <h1 className="px-4 font-normal text-[14px] leading-[100%] text-[#FFFFFF99] mt-4 ">
                      Resources
                    </h1>
                    <NavLink
                      to={path}
                      key={index}
                      className="flex gap-4 py-3.5 px-6"
                    >
                      <img src={img} alt="#" className="w-[18px] h-[16px]" />
                      <p className="font-normal text-[14px] leading-[14px] text-white ">
                        {text}
                      </p>
                    </NavLink>
                  </div>
                ) : (
                  <NavLink
                    to={path}
                    key={index}
                    className="flex gap-4 py-3.5 px-6"
                  >
                    <img src={img} alt="#" className="w-[18px] h-[16px]" />
                    <p className="font-normal text-[14px] leading-[14px] text-white ">
                      {text}
                    </p>
                  </NavLink>
                )}
              </>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col justify-between w-full h-screen">
        {/* Header */}
        <div className="flex justify-between items-center h-[77px] w-[82.2vw] bg-[#4338CA] gap-2">
          <div className="  border-none border-gray-200 flex items-center px-4">
            <div className="w-[55px] h-[45px] rounded-2xl  flex justify-center items-center bg-white">
              <img src="/Frame.png" alt="icon" className="w-[41px] h-[36px]" />
            </div>
            <h1 className="text-white bg-[#4338CA] text-[20px] font-normal ml-4">
              Legal Assistant
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-400 shadow-2xl mr-4 text-white rounded-[8px] border-none border-white "
          >
            Logout
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-4">
          {messages.map((msg, index) => (
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
          ))}

          {navigation.state === "submitting" && (
            <div className="flex justify-center items-center mt-20">
              <div className="w-10 h-10 border-4 bg-black border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message input with voice */}
        <div className="p-4 bg-white border-gray-200 border-t">
          <form
            ref={formRef}
            method="post"
            className="flex gap-4 max-w-4xl mx-auto"
            onSubmit={handleSubmit}
          >
            {/* Voice button on the left */}
            <button
              type="button"
              onClick={startVoiceRecognition}
              className={`px-3 rounded-md border ${
                recognizing ? "bg-yellow-100" : "bg-gray-100"
              } border-gray-300`}
              title="Click to speak"
            >
              🎤
            </button>

            <input
              type="text"
              name="prompt"
              ref={inputRef}
              placeholder={
                navigation.state === "submitting"
                  ? "Please wait..."
                  : "Ask anything..."
              }
              className="flex-1 px-4 h-[40px] border border-[#E5E7EB] shadow rounded-[8px] outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-[#4F46E5] text-white px-6 h-[40px] rounded-[8px]"
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
