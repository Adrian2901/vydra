import { MessageSquarePlus } from "lucide-react";
import ChatButton from "./chat-button";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const Sidebar = forwardRef(({ currentChatId, setCurrentChatId }, ref) => {
  // Hook to fetch chat IDs from Redis
  const [chatIds, setChatIds] = useState([]);

  const refreshChatIds = async (newId) => {
    const ids = await getChatIds();
    setChatIds(ids);
    // Set the new chat ID or the first one if no new ID is provided
    // This kinda does not make sense but whatever
    setCurrentChatId(newId || ids[0]);
  };

  useImperativeHandle(ref, () => ({
    refreshChatIds,
  }));

  // Fetch chat IDs from Redis
  const getChatIds = async () => {
    const response = await fetch("/api/chatIds");
    const data = await response.json();

    return data || []; // Return an empty array if no data is found
  };

  const handleNewChat = () => {
    // Reset currentChatId to null when creating a new chat
    setCurrentChatId(new Date().getTime());
  };

  // Fetch chat IDs on component mount
  useEffect(() => {
    getChatIds().then((ids) => {
      setChatIds(ids);
      if (ids.length > 0) {
        setCurrentChatId(ids[0]); // Set the first chat ID as the default
      } else {
        setCurrentChatId("null"); // No chats available
      }
    });
  }, [setCurrentChatId]);

  return (
    <div className="w-1/5" id="sidebar">
      <p className="text-4xl text-primary pb-8">Vydra</p>
      <div>
        <button
          className="w-auto text-primary bg-accent rounded-2xl p-4 mb-4 hover:bg-primary hover:text-accent"
          onClick={() => setCurrentChatId("null")}
        >
          <MessageSquarePlus className="inline mr-2" />
          New Chat
        </button>
        <div className="flex flex-col justify-center items-center space-y-2">
          {chatIds.map((id) => (
            <ChatButton
              currentChatId={currentChatId}
              key={id}
              chatId={id}
              onClick={() => setCurrentChatId(id)} // Update currentChatId on click
              refreshChatIds={refreshChatIds}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
