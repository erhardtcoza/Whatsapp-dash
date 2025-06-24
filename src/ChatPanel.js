import React, { useState, useEffect, useRef } from "react";

export default function ChatPanel({ phone, contactName }) {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages when phone changes
  useEffect(() => {
    if (!phone) return;
    setLoading(true);
    fetch(`https://w-api.vinetdns.co.za/api/messages?phone=${phone}`)
      .then(res => res.json())
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [phone]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    await fetch("https://w-api.vinetdns.co.za/api/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, body: reply }),
    });
    setReply("");
    // Refresh messages
    setLoading(true);
    fetch(`https://w-api.vinetdns.co.za/api/messages?phone=${phone}`)
      .then(res => res.json())
      .then(setMessages)
      .finally(() => setLoading(false));
  }

  if (!phone) return (
    <div className="flex-1 flex items-center justify-center text-gray-500">
      Select a chat to start
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-red-700 text-white font-bold">
        {contactName || phone}
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 bg-[#f7f7fa]">
        {loading ? (
          <div className="text-gray-500 mt-4">Loading...</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.direction === "outgoing" ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`rounded-2xl px-4 py-2 shadow text-sm max-w-[70%] ${
                  msg.direction === "outgoing"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
                title={new Date(msg.timestamp).toLocaleString()}
              >
                {msg.body}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Reply box */}
      <form onSubmit={handleSendReply} className="p-4 border-t border-gray-200 bg-white flex gap-2">
        <input
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
          placeholder="Type your reply…"
          value={reply}
          onChange={e => setReply(e.target.value)}
        />
        <button
          className="bg-red-700 text-white px-5 py-2 rounded-xl font-bold shadow hover:bg-red-800"
          type="submit"
          disabled={loading || !reply.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
