"use client";
import React, { useState, useRef, useEffect } from "react";
import { Ellipsis, Pencil, Trash2, Download } from "lucide-react";

const ChatButton = ({ currentChatId, chatId, onClick, refreshChatIds }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);

  // Placeholder functions
  const handleRenameChat = () => {
    // console.log("Rename chat clicked");
  };

  const handleExportChat = async () => {
    try {
      const response = await fetch(`/api/chats?chatId=` + chatId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat data");
      }

      const chatData = await response.json();
      const blob = new Blob([JSON.stringify(chatData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `chat_${chatId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting chat:", error);
    }
  };

  const handleDeleteChat = async () => {
    try {
      const thisChatId = chatId;
      let response = await fetch(`/api/chats`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      let data = await response.json();
      console.log("Chat deleted:", data);

      // Delete the chat from the chatIds
      response = await fetch("/api/chatIds", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      data = await response.json();
      console.log("Chat ID deleted from chatIds:", data);

      if (currentChatId === thisChatId) {
        console.log("Current chat ID deleted, setting to null");
        refreshChatIds(null);
      }
      console.log("Refreshing chat IDs...");
      refreshChatIds(currentChatId);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="relative">
      <div
        id="chat-button-container"
        className="relative w-75 h-1/4 bg-primary p-2 rounded-2xl group hover:cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div
          className={`text-accent overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out text-start`}
          style={{
            maskImage: isHovered
              ? "linear-gradient(to right, black 70%, transparent 100%)"
              : "none",
            WebkitMaskImage: isHovered
              ? "linear-gradient(to right, black 70%, transparent 100%)"
              : "none",
          }}
        >
          chat {chatId}
        </div>
        <button
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-accent transition duration-300 ease-in-out hover:cursor-pointer hover:bg-accent rounded-sm hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <Ellipsis />
        </button>
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-full -right-35 mt-2 z-50 bg-accent text-primary rounded-md shadow-md p-2 w-48 flex flex-col gap-1"
        >
          <button
            className="hover:bg-gray-100 rounded px-2 py-1 text-left flex items-center gap-x-2 cursor-not-allowed"
            onClick={handleRenameChat}
          >
            <Pencil className="inline mr-1" />
            Rename Chat
          </button>
          <button
            className="hover:bg-gray-100 rounded px-2 py-1 text-left flex items-center gap-x-2"
            onClick={handleExportChat}
          >
            <Download className="inline mr-1" />
            Export Chat
          </button>
          <button
            className="hover:bg-gray-100 rounded px-2 py-1 text-left text-red-500 flex items-center gap-x-2"
            onClick={handleDeleteChat}
          >
            <Trash2 className="inline mr-1" />
            Delete Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatButton;
