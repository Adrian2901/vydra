"use client";
import React, { useState } from "react";
import { CirclePlus } from "lucide-react";
import FileMessage from "./file-message";
import ContentMessage from "./content-message";

/**
 * Creates a message object with the specified role, content, and type.
 * Type is used to displayed the message in the UI.
 * The other two fields are passed to the LLM request.
 *
 * @param {string} role - The role of the message sender (e.g., "user", "system").
 * @param {string} content - The content of the message.
 * @param {string} [type="text"] - The type of the message, either "text" or "file".
 * @returns {{role: string, content: string, type: string}} The constructed message object.
 */
const createMessage = (role, content, type = "text", file = null) => ({
  role,
  content,
  type, // text or file to display in the ui
  file,
});

const Chat = () => {
  // placeholder messages, remove later
  const message1 = createMessage(
    "assistant",
    "Hello! How can I help you today? ^^"
  );

  const message2 = createMessage(
    "assistant",
    "# Kamen Rider\n\nKamen Rider is a Japanese *tokusatsu* franchise created by Shotaro Ishinomori. It features masked heroes who fight against evil organizations, often using motorcycles and unique transformation belts. The series has been a cultural phenomenon since its debut in 1971, inspiring numerous adaptations, movies, and spin-offs.\n\n## Key Elements\n- **Henshin (Transformation):** The iconic transformation sequence where the hero dons their Rider suit.\n- **Rider Kick:** A signature finishing move used to defeat enemies.\n- **Motorcycles:** A staple of the franchise, often customized for each Rider.\n\n## Popular Series\n- Kamen Rider Ichigo (1971)\n- Kamen Rider Kuuga (2000)\n- Kamen Rider Build (2017)\n- Kamen Rider Zero-One (2019)\n\nKamen Rider continues to captivate audiences with its blend of action, drama, and heroism."
  );

  const [messages, setMessages] = useState([message1, message2]);
  const [file, setFile] = useState();

  const sendMessage = async (newMessageObjects) => {
    // Append the new messages object to the existing messages
    const newMessages = [...messages, ...newMessageObjects];
    setMessages(newMessages);

    console.log(newMessages);

    const request = {
      model: "llama3.2:1b",
      messages: newMessages.map(({ role, content }) => ({ role, content })),
      stream: false,
      options: {
        temperature: 0.2, // Lower temperature for more focused responses
      },
    };

    const response = await fetch("http://83.254.164.134:11434/api/chat", {
      method: "POST",
      body: JSON.stringify(request),
    });

    const data = await response.json();

    setMessages((prevMessages) => [
      ...prevMessages,
      createMessage("assistant", data.message.content),
    ]);

    console.log(messages);
  };

  const [inputValue, setInputValue] = useState("");
  const [fileContent, setFileContent] = useState("");

  const handleSendMessage = () => {
    const newMessages = [];

    // Append the file if there is one
    if (fileContent.trim() !== "") {
      // These naming conventions are so bad
      const fileObjectData = {
        name: file.name,
        size: file.size,
        ext: file.name.split(".").pop(),
      };

      const fileObject = createMessage(
        "user",
        fileContent,
        "file",
        fileObjectData
      );
      newMessages.push(fileObject);
      setFile();
      setFileContent("");
    }

    // Append the user message if there is one
    if (inputValue.trim() !== "") {
      const messageObject = createMessage("user", inputValue);
      newMessages.push(messageObject);
      setInputValue("");
    }

    if (newMessages.length > 0) {
      sendMessage(newMessages);
    }
  };

  const handleKeypress = (e) => {
    if (e.code === "Enter") {
      handleSendMessage();
    }
  };

  const handleFileUpload = (e) => {
    // Safe check
    if (e.target.files.length === 0) {
      console.error("Error! No files provided.");
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
          case "text/plain":
            text = result;
            break;
          case "application/json":
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
          console.error("Error! Text could not be parsed.");
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
      <div className="flex-col w-full space-y-8">
        {messages.map((message, index) => (
          <ContentMessage message={message} key={index} />
        ))}
      </div>
      <div
        className="flex flex-row justify-around h-1/4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="w-11/12 flex flex-col">
          <div className="flex items-center space-x-1">
            <label className="bg-accent text-primary text-xl rounded-xl my-2 h-12 w-12 cursor-pointer flex items-center justify-center">
              <input
                type="file"
                accept=".txt, .json"
                className="hidden"
                onChange={handleFileUpload}
              />
              <CirclePlus />
            </label>

            {file && (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setFile();
                  setFileContent("");
                }}
              >
                <FileMessage file={file} clickable={true} />
              </div>
            )}
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
