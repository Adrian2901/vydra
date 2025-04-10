"use client";
import React, { useState, useRef, useEffect } from "react";
import { Ellipsis, Pencil, Trash2, Download } from "lucide-react";

const ChatButton = ({ chatId, onClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);

  // Placeholder functions
  const handleRenameChat = () => {
    console.log("Rename chat clicked");
  };

  const handleExportChat = () => {
    console.log("Export chat clicked");
  };

  const handleDeleteChat = () => {
    console.log("Delete chat clicked");
    fetch(`/api/chats`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Chat deleted:", data);
        // Optionally, you can call a function to refresh the chat list here
      })
      .catch((error) => {
        console.error("Error deleting chat:", error);
      });
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
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            className="hover:bg-gray-100 rounded px-2 py-1 text-left flex items-center gap-x-2"
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
