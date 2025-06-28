
export default function MessageBubble({
  m,
  colors,
}: {
  m: any;
  colors: any;
}) {
  return (
    <div
      style={{
        background: m.direction === "outgoing" ? colors.msgOut : colors.msgIn,
        color: m.direction === "outgoing" ? "#fff" : colors.text,
        padding: "8px 12px",
        borderRadius: 8,
        maxWidth: "70%",
        wordBreak: "break-word",
        marginBottom: 2,
      }}
    >
      {/* Text Body */}
      {m.body && <div>{m.body}</div>}

      {/* Image */}
      {m.media_url && /\.(jpg|jpeg|png|gif)$/i.test(m.media_url) && (
        <img
          src={m.media_url}
          alt="attachment"
          style={{ maxWidth: "100%", borderRadius: 6, marginTop: 8 }}
        />
      )}

      {/* Audio */}
      {m.media_url && /\.(mp3|ogg|wav)$/i.test(m.media_url) && (
        <audio controls style={{ width: "100%", marginTop: 8 }}>
          <source src={m.media_url} />
          Your browser does not support audio.
        </audio>
      )}

      {/* Document */}
      {m.media_url &&
        !/\.(jpg|jpeg|png|gif|mp3|ogg|wav)$/i.test(m.media_url) &&
        !m.location_json && (
          <a
            href={m.media_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 8,
              color: colors.red,
              textDecoration: "underline",
            }}
          >
            Download attachment
          </a>
        )}

      {/* Location */}
      {m.location_json && (() => {
        try {
          const loc = JSON.parse(m.location_json);
          const mapUrl = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
          return (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 8,
                color: colors.red,
                textDecoration: "underline",
              }}
            >
              View location
            </a>
          );
        } catch {
          return null;
        }
      })()}
    </div>
  );
}
