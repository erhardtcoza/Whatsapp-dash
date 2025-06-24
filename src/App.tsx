import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";

export default function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedName, setSelectedName] = useState(null);

  // Handle when a chat is selected in the sidebar
  function handleSelectChat(chat) {
    setSelectedChat(chat.from_number);
    setSelectedName(chat.name || chat.email || chat.from_number);
  }

  return (
    <div className="flex h-screen bg-[#f7f7fa]">
      {/* Sidebar with chat list */}
      <Sidebar onSelectChat={handleSelectChat} selectedPhone={selectedChat} />

      {/* Main chat panel */}
      <div className="flex-1 flex flex-col">
        <ChatPanel phone={selectedChat} contactName={selectedName} />
      </div>
    </div>
  );
}
