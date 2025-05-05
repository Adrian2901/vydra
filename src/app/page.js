"use client";
import { useState, useRef, useCallback } from "react";
import Chat from "../app/components/chat";
import Sidebar from "./components/sidebar";

export default function Home() {
  // Hook to manage the current chat ID
  const [currentChatId, setCurrentChatId] = useState(null);
  const sidebarRef = useRef();

  const refreshSidebar = useCallback((newId) => {
    if (sidebarRef.current) {
      sidebarRef.current.refreshChatIds(newId);
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* <p>DEBUG: {currentChatId}</p> */}
      <header className="h-4"></header>

      <main className="text-center flex-grow flex">
        <Sidebar
          currentChatId={currentChatId}
          ref={sidebarRef}
          setCurrentChatId={setCurrentChatId}
        />
        <div className="w-4/5 bg-primary rounded-l-2xl py-4 flex flex-col justify-between">
          <Chat
            chatId={currentChatId}
            refreshChatIds={refreshSidebar}
            setCurrentChatId={setCurrentChatId}
          />
        </div>
      </main>

      <footer className="p-2 text-center text-primary">
        <p>Copyright © 2025 Adrian Hassa, Ionel Pop, Teodora Portase</p>
      </footer>
    </div>
  );
}
