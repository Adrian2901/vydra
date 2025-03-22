"use client";
import React, { useState } from "react";
import { Bot, User } from "lucide-react";

const Chat = () => {
  // placeholder messages, remove later
  const message1 = {
    role: "bot",
    message: "Hello! How can I help you today? ^^",
  };
  const message2 = {
    role: "user",
    message:
      "Can you help me improve this bug report? I dont know to write good quality bug reports:(",
  };
  const message3 = {
    role: "bot",
    message:
      "Certainly! I'd be happy to help you improve your bug report. Please provide the details of the bug report you have, and I'll assist you in refining it.",
  };

  const [messages, setMessages] = useState([message1, message2, message3]);

  const addMessage = (message) => {
    setMessages([...messages, { role: "user", message: message }]);

    // Add a placeholder bot response after 0.5s
    // This should be replaced with the llm call
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "bot",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      ]);
    }, 500);
  };

  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      addMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeypress = (e) => {
    if (e.code === "Enter") {
      handleSendMessage();
    }
  };

  const handleFileUpload = (e) => {
    console.log(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    console.log(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="w-full space-y-8">
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`flex text-left text-xl mx-8 ${
                message.role === "bot"
                  ? "justify-start"
                  : "justify-end text-right"
              }`}
            >
              {message.role === "bot" && <Bot color="black" size={36} />}
              <p className="my-auto mx-4">{message.message}</p>
              {message.role === "user" && <User color="black" size={36} />}
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex flex-row justify-around h-1/4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="w-11/12 flex flex-col">
          <label className="bg-accent text-primary text-xl rounded-xl my-2 h-12 w-12 cursor-pointer flex items-center justify-center">
            <input
              type="file"
              accept=".txt, .json"
              className="hidden"
              onChange={handleFileUpload}
            />
            +
          </label>

          <textarea
            className="w-full h-2/3 resize-none p-4 bg-secondary text-primary rounded-2xl"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeypress}
          ></textarea>
        </div>
        <button
          className="bg-accent text-primary py-2 px-6 rounded-xl h-12 my-auto cursor-pointer"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default Chat;
