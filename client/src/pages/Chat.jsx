import React, { useRef, useState, useEffect } from "react";
import { Form, useLoaderData, useNavigation, redirect, useSubmit } from "react-router-dom";
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

const Chat = () => {
  const { currentSession } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const formRef = useRef();
  const inputRef = useRef();
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(currentSession?.messages || []);

  useEffect(() => {
    setMessages(currentSession?.messages || []);
  }, [currentSession]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

    // Submit form manually
    submit(formRef.current, { method: "post" });

    try {
      const res = await customFetch.post(`/create/${currentSession?.userId}`, { prompt });
      const responseMessage = {
        role: "assistant",
        response: res.data.response,
      };
      setMessages((prev) => [...prev, responseMessage]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      formRef.current.reset();
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-[256px] h-screen bg-[#4338CA]">
        <div className="h-[77px] border-b border-gray-200 flex justify-center items-center gap-4">
          <img src="/chat.png" alt="chat" className="w-[30px] h-[24px]" />
          <h1 className="text-[20px] font-semibold text-white">Nayay Mitra</h1>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col justify-between w-full h-screen">
        {/* Header */}
        <div className="h-[77px] bg-[#4338CA] flex items-center px-4">
          <div className="w-[55px] h-[45px] rounded-2xl flex justify-center items-center bg-white">
            <img src="/Frame.png" alt="icon" className="w-[41px] h-[36px]" />
          </div>
          <h1 className="text-white text-[20px] font-normal ml-4">Legal Assistant</h1>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] p-4 rounded-lg shadow ${
                msg.role === "user"
                  ? "bg-white self-end ml-auto border border-gray-300"
                  : "bg-[#E0E7FF] self-start mr-auto"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">
                {msg.role === "user" ? msg.prompt : msg.response}
              </p>
            </div>
          ))}

{navigation.state === "submitting" && (
  <div className="flex justify-center items-center mt-20">
    <div className="w-10 h-10 border-4 bg-black border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
)}


          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="p-4 bg-white border-t">
          <form ref={formRef} method="post" className="flex gap-4 max-w-4xl mx-auto" onSubmit={handleSubmit}>
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
