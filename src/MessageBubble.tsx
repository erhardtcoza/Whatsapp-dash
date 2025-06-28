export default function MessageBubble({
  m,
  colors,
}: {
  m: any;
  colors: any;
}) {
  // -- IMAGE --
  if (m.media_url && /\.(jpe?g|png|gif|webp)$/i.test(m.media_url)) {
    return (
      <div
        style={{
          background: m.direction === "outgoing" ? colors.msgOut : "#eee",
          color: m.direction === "outgoing" ? "#fff" : colors.text,
          padding: "8px 12px",
          borderRadius: 16,
          maxWidth: 320,
          wordBreak: "break-word",
          marginBottom: 8,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <img
          src={m.media_url}
          alt="attachment"
          style={{ maxWidth: 250, maxHeight: 250, borderRadius: 8, display: "block" }}
        />
        {/* Only show caption/text if it's not a redundant [Image] */}
        {m.body && m.body !== "[Image]" && <div style={{ marginTop: 6 }}>{m.body}</div>}
      </div>
    );
  }

  // -- AUDIO --
  if (m.media_url && /\.(mp3|ogg|wav|m4a)$/i.test(m.media_url)) {
    return (
      <div
        style={{
          background: m.direction === "outgoing" ? colors.msgOut : "#eee",
          color: m.direction === "outgoing" ? "#fff" : colors.text,
          padding: 10,
          borderRadius: 16,
          maxWidth: 320,
          marginBottom: 8,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <audio controls style={{ width: "100%" }}>
          <source src={m.media_url} />
          Your browser does not support audio.
        </audio>
      </div>
    );
  }

  // -- DOCUMENT --
  if (
    m.media_url &&
    !/\.(jpe?g|png|gif|webp|mp3|ogg|wav|m4a)$/i.test(m.media_url) &&
    !m.location_json
  ) {
    return (
      <div
        style={{
          background: m.direction === "outgoing" ? colors.msgOut : "#eee",
          color: m.direction === "outgoing" ? "#fff" : colors.text,
          padding: 10,
          borderRadius: 16,
          maxWidth: 320,
          marginBottom: 8,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <a
          href={m.media_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: colors.red,
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          Download attachment
        </a>
        {m.body && <div style={{ marginTop: 6 }}>{m.body}</div>}
      </div>
    );
  }

  // -- LOCATION --
  if (m.location_json) {
    try {
      const loc = JSON.parse(m.location_json);
      const mapUrl = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
      return (
        <div
          style={{
            background: m.direction === "outgoing" ? colors.msgOut : "#eee",
            color: m.direction === "outgoing" ? "#fff" : colors.text,
            padding: 10,
            borderRadius: 16,
            maxWidth: 320,
            marginBottom: 8,
            boxShadow: "0 2px 8px #0001",
          }}
        >
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: colors.red,
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            View location
          </a>
          {/* Only show extra body if not the default LOCATION text */}
          {m.body && m.body !== `[LOCATION: ${loc.latitude},${loc.longitude}]` && (
            <div style={{ marginTop: 6 }}>{m.body}</div>
          )}
        </div>
      );
    } catch {
      // fallback if bad JSON
      return (
        <div
          style={{
            background: m.direction === "outgoing" ? colors.msgOut : "#eee",
            color: m.direction === "outgoing" ? "#fff" : colors.text,
            padding: 10,
            borderRadius: 16,
            maxWidth: 320,
            marginBottom: 8,
            boxShadow: "0 2px 8px #0001",
          }}
        >
          <div>Location: {m.location_json}</div>
        </div>
      );
    }
  }

  // -- TEXT ONLY (or fallback) --
  return (
    <div
      style={{
        background: m.direction === "outgoing" ? colors.msgOut : colors.msgIn,
        color: m.direction === "outgoing" ? "#fff" : colors.text,
        padding: "10px 14px",
        borderRadius: 16,
        maxWidth: 320,
        wordBreak: "break-word",
        marginBottom: 8,
        boxShadow: "0 2px 8px #0001",
      }}
    >
      {/* Only show if not a redundant [Image] */}
      {(!m.media_url || m.body !== "[Image]") && !!m.body && <div>{m.body}</div>}
    </div>
  );
}
