import { useEffect, useRef, useState } from "react";
import { API_BASE } from "./config";

export default function ChatPanel({ phone, contact, colors }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!phone) return;
    setLoading(true);
    fetch(`${API_BASE}/api/messages?phone=${phone}`)
      .then(res => res.json())
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [phone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendReply(e: any) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, body: reply })
    });
    setReply("");
    // Reload messages
    fetch(`${API_BASE}/api/messages?phone=${phone}`)
      .then(res => res.json())
      .then(setMessages)
      .finally(() => setSending(false));
  }

  function renderMessageBody(msg: any) {
    // 1. IMAGE
    if (msg.media_url && /\.(jpe?g|png|gif|webp)$/i.test(msg.media_url)) {
      return (
        <a href={msg.media_url} target="_blank" rel="noopener noreferrer">
          <img
            src={msg.media_url}
            alt="WhatsApp Media"
            style={{ maxWidth: 180, maxHeight: 180, borderRadius: 12, margin: "4px 0" }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </a>
      );
    }

    // 2. AUDIO/VOICE NOTE
    if (msg.media_url && /\.(mp3|ogg|wav|m4a|aac)$/i.test(msg.media_url)) {
      // Voice note rejection
      if (
        msg.body?.toLowerCase().includes("voice") ||
        msg.body?.toLowerCase().includes("[audio]")
      ) {
        return (
          <div style={{ color: "red", fontWeight: 600 }}>
            Voice notes are not accepted. Sender was notified.
          </div>
        );
      }
      // If regular audio, offer play link
      return (
        <audio controls style={{ margin: "8px 0", width: 180 }}>
          <source src={msg.media_url} />
          Your browser does not support audio playback.
        </audio>
      );
    }

    // 3. LOCATION
    if (msg.location_json) {
      try {
        const loc = JSON.parse(msg.location_json);
        const mapsUrl = `https://maps.google.com/?q=${loc.latitude},${loc.longitude}`;
        return (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.red, textDecoration: "underline", fontWeight: 600 }}
          >
            📍 View Location<br />
            <span style={{ fontSize: 13, color: colors.text }}>
              ({loc.latitude}, {loc.longitude})
            </span>
          </a>
        );
      } catch {
        return "[Invalid location data]";
      }
    }

    // 4. DOCUMENTS/OTHER FILES
    if (
      msg.media_url && (
        /\.(pdf|docx?|xlsx?|pptx?|txt|csv|zip|rar)$/i.test(msg.media_url) ||
        !/\.(jpe?g|png|gif|webp|mp3|ogg|wav|m4a|aac)$/i.test(msg.media_url) // unknown file type
      )
    ) {
      const filename = msg.media_url.split("/").pop()?.split("?")[0] || "Download";
      return (
        <a
          href={msg.media_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.red, fontWeight: 600, textDecoration: "underline" }}
        >
          📎 {filename}
        </a>
      );
    }

    // 5. FALLBACK: BODY
    return msg.body;
  }

  if (!phone) return (
    <div style={{ color: colors.sub, padding: 40, textAlign: "center" }}>
      Select a chat to view conversation.
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 380, background: colors.bg, borderRadius: 12, marginTop: 28 }}>
      {/* Header */}
      <div style={{ background: colors.card, padding: 16, fontWeight: 600, color: colors.red, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        {contact?.name || contact?.email || phone}
      </div>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 10px 18px", background: colors.bg }}>
        {loading ? (
          <div style={{ color: colors.sub, textAlign: "center" }}>Loading…</div>
        ) : (
          messages.length === 0 ? (
            <div style={{ color: colors.sub, textAlign: "center", marginTop: 40 }}>No messages</div>
          ) : (
            messages.map((msg: any) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.direction === "outgoing" ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    background: msg.direction === "outgoing" ? colors.red : colors.msgIn,
                    color: msg.direction === "outgoing" ? "#fff" : colors.text,
                    borderRadius: 16,
                    padding: "8px 16px",
                    maxWidth: "72%",
                    fontSize: 15,
                    boxShadow: "0 1px 4px #0001",
                  }}
                  title={new Date(msg.timestamp).toLocaleString()}
                >
                  {renderMessageBody(msg)}
                </div>
              </div>
            ))
          )
        )}
        <div ref={messagesEndRef}></div>
      </div>
      {/* Reply form */}
      <form onSubmit={sendReply} style={{ display: "flex", gap: 10, background: colors.card, padding: 16, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <input
          style={{
            flex: 1,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            padding: "8px 14px",
            fontSize: 15,
            outline: "none",
            background: colors.input,
            color: colors.inputText
          }}
          placeholder="Type your reply…"
          value={reply}
          disabled={sending}
          onChange={e => setReply(e.target.value)}
        />
        <button
          type="submit"
          disabled={sending || !reply.trim()}
          style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 15,
            padding: "8px 26px",
            cursor: sending ? "default" : "pointer",
            opacity: sending ? 0.7 : 1
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
