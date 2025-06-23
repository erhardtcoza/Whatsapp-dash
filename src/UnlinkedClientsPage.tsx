import React from "react";

type Props = {
  colors: any;
};

export default function UnlinkedClientsPage({ colors }: Props) {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text }}>Unlinked Clients</h2>
      <div style={{ color: colors.sub }}>
        (No unlinked clients yet. This is a placeholder page.)
      </div>
    </div>
  );
}
