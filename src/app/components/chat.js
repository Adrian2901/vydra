"use client";
import React, { useState, useEffect } from "react";
import { Bot, Github, CirclePlus, LoaderCircle } from "lucide-react";
import FileMessage from "./file-message";
import ContentMessage from "./content-message";
import { Octokit } from "octokit";

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
const Chat = ({ chatId, refreshChatIds, setCurrentChatId }) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

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
  const [file, setFile] = useState();
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issues, setIssues] = useState([]);
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
          // New chat
          // Establish the system prompt
          const system_message = createMessage(
            "system",
            `Your role is a senior software engineer, you are very good at analyzing and writing bug reports. Check if the following parts exist in the bug report:
    - Steps to Reproduce: how the bug was found and the actions needed to recreate that process,
    - Stack Traces: report of the stack frames at the time of the bug,
    - Test Cases: methods to test the component where the bug is occuring,
    - Observed Behavior: what the user sees when the bug is happening (in text or images),
    - Expected Behavior: what the application should be doing

If they do not exist, tell the user they need to provide them. Check if the grammar and formatting of the text is correct.
If it is not correct, tell the user to fix it and how to fix it.
Do not summarize the bug report and do not offer solutions to fixing the bug.
    `
          );

          // Establish the first message
          const message1 = createMessage(
            "assistant",
            "Hello! How can I help you today? ^^"
          );

          // Add messages to the array
          setMessages([system_message, message1]);
        }
      })
      .catch((error) => {
        console.error("Error fetching chat IDs:", error);
      });
  }, [chatId, refreshChatIds, setCurrentChatId]);

  const sendMessage = async (newMessageObjects) => {
    // Append the new messages object to the existing messages
    const newMessages = [...messages, ...newMessageObjects];
    setMessages(newMessages);
    scrollChat();

    // If it's the first chat, create a new chatId
    let thisChatId = chatId === "null" ? String(new Date().getTime()) : chatId;
    let shouldRefresh = false;
    if (chatId === "null") {
      shouldRefresh = true;
      // If it's the first chat, set the chatId to the new one
      setCurrentChatId(thisChatId);
      // Save the new chatId to the database
      await fetch("/api/chatIds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: thisChatId }),
      });

      // Save the old messages to the database
      newMessages.forEach(async (message) => {
        await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId: thisChatId, message }),
        });
      });
    }

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

    // Send the request to the LLM API
    const response = await fetch("/api/llm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      alert(
        "Error: Could not fetch response from the LLM, please try again later!"
      );
      return;
    }

    const data = await response.json();

    const message = createMessage("assistant", data.message.content);
    // Save the new message to the database
    const response2 = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: thisChatId, message }),
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
    if (shouldRefresh) {
      refreshChatIds(thisChatId);
    }
  };

  const getAllIssues = async () => {
    const input = prompt(
      "Please provide the owner and repository name in the format 'owner/repo' to fetch all issues."
    );
    const [owner, repo] = input.split("/");
    try {
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/issues",
        {
          owner: owner,
          repo: repo,
        }
      );
      if (response.status === 200) {
        const res = response.data;
        const issues = res.map((issue) => {
          return {
            owner: owner,
            repo: repo,
            title: issue.title,
            number: issue.number,
          };
        });
        setIssues(issues);
        setShowIssueModal(true);
      } else {
        alert("Error fetching issues!");
        setIssues([]);
      }
    } catch (error) {
      alert(
        "Error fetching issues! Make sure that the repository is valid and you have access to it."
      );
      setIssues([]);
    }
  };

  const getIssue = async (owner, repo, issueNumber) => {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}",
      {
        owner: owner,
        repo: repo,
        issue_number: issueNumber,
      }
    );
    if (response.status === 200) {
      const res = response.data;
      const title = res.title;
      const body = res.body;
      const messageObject = createMessage(
        "user",
        "GitHub issue: " + title + "\n\n---\n\n" + body
      );
      sendMessage([messageObject]);
    } else {
      alert("Error fetching issue! Please try again later.");
    }
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
      setInputValue("");
    }

    if (newMessages.length > 0) {
      const messagesPromise = newMessages.map((message) =>
        fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId: chatId, message }),
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
      {/* <div>DEBUG: {chatId}</div> */}
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
            <div
              className="bg-accent text-primary text-xl rounded-xl my-2 h-12 w-12 cursor-pointer flex items-center justify-center"
              onClick={() => {
                getAllIssues();
              }}
            >
              <Github />
            </div>
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
        {showIssueModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-secondary rounded-xl shadow-lg w-4/5 max-w-md max-h-[80vh] overflow-y-auto p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Select an Issue</h2>
                <button
                  className="text-lg text-red-500 cursor-pointer"
                  onClick={() => setShowIssueModal(false)}
                >
                  X
                </button>
              </div>
              {issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-primary border rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    getIssue(issue.owner, issue.repo, issue.number);
                    setShowIssueModal(false);
                  }}
                >
                  #{issue.number} - {issue.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
