"use client";
import React, { useEffect, useState } from "react";
import { Bot, CirclePlus, LoaderCircle } from "lucide-react";
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

// Receive chat id as a prop
const Chat = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const availableModels = [
    "llama3.2",
    "llama3.2:1b",
    "llama3.1",
    "qwen2.5:72b",
    "qwen2.5:14b",
    "mistral-large",
    "phi4-mini",
  ];
  const [model, setModel] = useState("llama3.2");
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [file, setFile] = useState();
  const [inputValue, setInputValue] = useState("");
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    setCurrentChatId(chatId);
    // Check if the chatId provided is stored in the sorted set in Redis
    fetch(`/api/chatIds`)
      .then((response) => response.json())
      .then((data) => {
        const chatIds = data || [];
        // Check if chatId is in the list of chat IDs
        if (chatIds.includes(chatId)) {
          // Chat ID exists, fetch messages
          fetch(`/api/chats?chatId=${chatId}`)
            .then((response) => response.json())
            .then((data) => {
              setMessages(data.messages || []);
            })
            .catch((error) => {
              console.error("Error fetching chats:", error);
              setMessages([]); // Fallback to empty array if there's an error
            });
        } else {
          // First chat
          console.log("New chatId provided!");

          // placeholder messages, remove later
          const message = createMessage(
            "assistant",
            "Hello! How can I help you today? ^^"
          );

          setMessages([message]);
          console.log("Current chatId:", currentChatId);
          console.log("First message:", message);
          // Save chatId and first message to the database
          const saveChatData = async () => {
            await fetch("/api/chatIds", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chatId: currentChatId }),
            });

            await fetch("/api/chats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chatId: currentChatId, message }),
            });
          };

          saveChatData();
        }
      })
      .catch((error) => {
        console.error("Error fetching chat IDs:", error);
      });
  }, [chatId, currentChatId]);

  const sendMessage = async (newMessageObjects) => {
    // Append the new messages object to the existing messages
    const newMessages = [...messages, ...newMessageObjects];
    setMessages(newMessages);
    scrollChat();

    // Enable the loading spinner
    setIsThinking(true);

    const request = {
      model: model,
      messages: newMessages.map(({ role, content }) => ({ role, content })),
      stream: false,
      options: {
        temperature: 0.2, // Lower temperature for more focused responses
      },
    };

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      alert(
        "Error: Could not fetch response from the LLM, please try again later!"
      );
      console.log(response.statusText);
      return;
    }

    const data = await response.json();
    // Simulate a response for now
    // const data = {
    //   message: {
    //     content: "This is a simulated response from the LLM.",
    //     role: "assistant",
    //   },
    // };

    const message = createMessage("assistant", data.message.content);

    const response2 = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: currentChatId, message }),
    });

    if (!response2.ok) {
      throw new Error("Failed to save message to the database");
    }

    setMessages((prevMessages) => {
      const updatedMessages = [
        ...prevMessages,
        createMessage("assistant", data.message.content),
      ];
      scrollChat();
      return updatedMessages;
    });
    setIsThinking(false);
  };

  const handleSendMessage = async () => {
    const newMessages = [];

    // Append the file if there is one
    if (fileContent.trim() !== "") {
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
      // Append the file message
      newMessages.push(fileObject);
      setFile();
      setFileContent("");
    }

    // Append the user message if there is one
    if (inputValue.trim() !== "") {
      const messageObject = createMessage("user", inputValue);
      newMessages.push(messageObject);
      console.log("Append user message:", JSON.stringify(messageObject));
      setInputValue("");
    }

    if (newMessages.length > 0) {
      const messagesPromise = newMessages.map((message) =>
        fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId: currentChatId, message }),
        })
      );

      // Wait for all messages to be saved
      await Promise.all(messagesPromise);
      await sendMessage(newMessages);
    }
  };

  const handleKeypress = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
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

  const scrollChat = () => {
    setTimeout(() => {
      const chatContainer = document.querySelector(".chatbox");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  };

  return (
    <>
      <div className="flex-col w-full space-y-8 overflow-y-auto max-h-[64vh] [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-thumb]:bg-secondary [&::-webkit-scrollbar-thumb]:rounded-full chatbox">
        {messages.map((message, index) => (
          <ContentMessage message={message} key={index} />
        ))}
        {isThinking && (
          <div className="flex mx-2">
            <Bot color="black" size={36} />
            <LoaderCircle
              className="animate-spin mx-4"
              color="black"
              size={36}
            />
          </div>
        )}
      </div>
      <div
        className="flex flex-row justify-around h-1/4 mb-2"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="w-full flex flex-col px-6">
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
          <div className="flex w-full space-x-4 h-2/3">
            <textarea
              className="w-full resize-none p-4 bg-secondary text-primary rounded-2xl"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeypress}
            ></textarea>
            <button
              className="bg-accent text-primary py-2 px-6 rounded-xl h-12 my-auto cursor-pointer"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>

          <select
            className="rounded-xl py-2 w-32"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {availableModels.map((availableModel) => (
              <option key={availableModel} value={availableModel}>
                {availableModel}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default Chat;
