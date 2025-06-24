import React, { useState, useEffect } from "react";

// You may want to add search or other controls—here’s the base version:
export default function Sidebar({ onSelectChat, selectedPhone }) {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://w-api.vinetdns.co.za/api/chats")
      .then(res => res.json())
      .then(setChats);
  }, []);

  // Filter chats by search input
  const filteredChats = chats.filter(chat => {
    const target = (chat.name || chat.email || chat.from_number || "").toLowerCase();
    return target.includes(search.toLowerCase());
  });

  return (
    <div className="w-80 bg-[#f7f7fa] border-r border-gray-200 h-full flex flex-col">
      {/* Logo and Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200 bg-white">
        <img
          src="https://static.vinet.co.za/logo.jpeg"
          alt="Vinet Logo"
          className="h-8 w-8 mr-3 rounded"
        />
        <span className="text-xl font-bold text-red-700">Vinet WhatsApp Admin</span>
      </div>

      {/* Search box */}
      <div className="px-4 py-2 bg-white border-b border-gray-200">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search chats"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
        />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 && (
          <div className="px-4 py-8 text-gray-400 text-center text-sm">No chats found</div>
        )}
        {filteredChats.map(chat => (
          <div
            key={chat.from_number}
            onClick={() => onSelectChat(chat)}
            className={`px-4 py-3 cursor-pointer border-b border-gray-100 flex items-center justify-between
              ${selectedPhone === chat.from_number ? "bg-red-50" : "hover:bg-gray-100"}
            `}
          >
            <div>
              <div className="font-semibold text-sm truncate w-44">
                {chat.name || chat.email || chat.from_number}
              </div>
              <div className="text-xs text-gray-500 truncate w-44">{chat.last_message}</div>
            </div>
            <div className="flex items-center">
              {chat.unread_count > 0 && (
                <span className="inline-block bg-red-600 text-white text-xs rounded-full px-2 ml-2">
                  {chat.unread_count}
                </span>
              )}
              {chat.tag && (
                <span className="ml-2 text-xs bg-gray-200 rounded px-2 py-0.5 text-gray-700 capitalize">
                  {chat.tag}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
