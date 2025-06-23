import React from "react";

type Props = {
  colors: any;
  onSelectChat: (chat: any) => void;
  selectedChat?: any;
};

export default function AllChatsPage({ colors, onSelectChat, selectedChat }: Props) {
  // ...your table logic
  return <div style={{ padding: 32 }}>All Chats Placeholder</div>;
}
