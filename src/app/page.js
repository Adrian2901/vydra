"use client";
import React from "react";
import Chat from "../app/components/chat";
import ChatButton from "../app/components/chat-button";
import { MessageSquarePlus } from "lucide-react";

export default function Home() {
  // Hook to fetch chat IDs from Redis
  const [chatIds, setChatIds] = React.useState([]);
  // Hook to manage the current chat ID
  const [currentChatId, setCurrentChatId] = React.useState(null);

  const handleNewChat = () => {
    // Reset currentChatId to null when creating a new chat
    setCurrentChatId(new Date().getTime());
  };

  // Fetch chat IDs from Redis
  const getChatIds = async () => {
    const response = await fetch("/api/chatIds");
    const data = await response.json();

    return data || []; // Return an empty array if no data is found
  };

  // Fetch chat IDs on component mount
  React.useEffect(() => {
    getChatIds().then((ids) => {
      setChatIds(ids);
      if (ids.length > 0) {
        setCurrentChatId(ids[0]); // Set the first chat ID as the default
      } else {
        setCurrentChatId(null); // No chats available
      }
    });
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="h-4"></header>

      <main className="text-center flex-grow flex">
        <div className="w-1/5" id="sidebar">
          <p className="text-4xl text-primary pb-8">Vydra</p>
          <div>
            <button
              className="w-auto text-primary bg-accent rounded-2xl p-4 mb-4 hover:bg-primary hover:text-accent"
              onClick={handleNewChat}
            >
              <MessageSquarePlus className="inline mr-2" />
              New Chat
            </button>
            <div className="flex flex-col justify-center items-center space-y-2">
              {chatIds.map((id) => (
                <ChatButton
                  key={id}
                  chatId={id}
                  onClick={() => setCurrentChatId(id)} // Update currentChatId on click
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-4/5 bg-primary rounded-l-2xl py-4 flex flex-col justify-between">
          <Chat chatId={currentChatId} />
        </div>
      </main>

      <footer className="p-2 text-center text-primary">
        <p>Copyright © 2025 Adrian Hassa, Ionel Pop, Teodora Portase</p>
      </footer>
    </div>
  );
}
