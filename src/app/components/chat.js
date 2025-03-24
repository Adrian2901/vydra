"use client";
import React, { useState } from "react";
import { Bot, User, File, X, CirclePlus } from "lucide-react";

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
  const [file, setFile] = useState();

  const sendMessage = (message) => {
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
  const [fileContent, setFileContent] = useState("");

  const handleSendMessage = () => {
    let msgString = ''
    if (inputValue.trim() !== "") {
      msgString += inputValue;
      setInputValue("");
    }

    if (fileContent.trim() !== "") {
      msgString += fileContent;
      setFile();
      setFileContent("");
    }

    sendMessage(msgString);
  };

  const handleKeypress = (e) => {
    if (e.code === "Enter") {
      handleSendMessage();
    }
  };

  const handleFileUpload = (e) => {
    // Safe check
    if (e.target.files.length === 0) {
      console.error('Error! No files provided.');
    }

    try {
      // Since it only allows for one uploaded file
      // take the first one
      const file = e.target.files[0];

      // Hook
      setFile(file);

      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        let text;

        switch (file.type) {
          case 'text/plain':
            text = result;
            break;
          case 'application/json':
            // Simply convert it to a string for now
            try {
              text = JSON.stringify(JSON.parse(result));
            } catch (error) {
              console.error(`Error! Invalid JSON format: ${error}`);
            }
            break;
          default:
            console.error(`Error! Unsupported file type: ${file.type}`);
            break;
        }

        // Hook
        if (text) {
          setFileContent(text);
        } else {
          setFileContent("");
          console.error('Error! Text could not be parsed.');
        }
      };

      reader.readAsText(file);

    } catch (error) {
      console.error(`Error! Could not process input file: ${error}`);
    }
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
              className={`flex text-left text-xl mx-8 ${message.role === "bot"
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
          <div className="flex items-center">
            <label className="bg-accent text-primary text-xl rounded-xl my-2 h-12 w-12 cursor-pointer flex items-center justify-center">
              <input
                type="file"
                accept=".txt, .json"
                className="hidden"
                onChange={handleFileUpload}
              />
              <CirclePlus />
            </label>

            {
              file &&
              <div className="bg-accent text-primary text-sm mx-2 rounded-xl my-2 px-4 h-12 w-auto cursor-pointer flex items-center justify-center" onClick={() => {
                setFile();
                setFileContent("");
              }}>
                <div className="flex items-center">
                  <File />
                  <div className="flex flex-col ml-2 items-start">
                    <p>{file.name}</p>
                    <p>{
                      Math.round((file.size / 1024) * 100) / 100
                    } KB</p>
                  </div>
                </div>
                <div className="relative ml-4">
                  <X size={16} />
                </div>
              </div>
            }

          </div>

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
