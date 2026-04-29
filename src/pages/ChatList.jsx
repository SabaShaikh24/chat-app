import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

function ChatList({ setIsLoggedIn, openChat }) {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  // ✅ Get logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id);
    };
    getUser();
  }, []);

  // ✅ Fetch after user loaded
  useEffect(() => {
    if (userId) fetchMessages(userId);
  }, [userId]);

  const fetchMessages = async (currentUserId) => {
    // 1️⃣ Get ALL messages (latest first)
    const { data: messagesData, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    // 2️⃣ Get participants
    const { data: participants } = await supabase
      .from("conversation_participants")
      .select("*");

    // 3️⃣ Keep ONLY latest message per conversation
    const latestMap = {};

    messagesData.forEach((msg) => {
      if (!latestMap[msg.conversation_id]) {
        latestMap[msg.conversation_id] = msg;
      }
    });

    const uniqueMessages = Object.values(latestMap);

    // 4️⃣ Attach other user
    const updated = uniqueMessages.map((msg) => {
      const users = participants.filter(
        (p) => p.conversation_id === msg.conversation_id
      );

      const otherUser = users.find(
        (u) => u.user_id !== currentUserId
      );

      return {
        ...msg,
        otherUserId: otherUser?.user_id || "Unknown User",
      };
    });

    setMessages(updated);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Chat List</h2>

      <button
        onClick={handleLogout}
        style={{
          marginBottom: "20px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      {messages.length === 0 && <p>No conversations</p>}

      {messages.map((msg) => (
        <div
          key={msg.conversation_id}
          onClick={() => openChat(msg.conversation_id)}
          style={{
            border: "1px solid #444",
            padding: "12px",
            marginBottom: "10px",
            cursor: "pointer",
            borderRadius: "10px",
            background: "#1e1e1e",
          }}
        >
          <p><b>User:</b> {msg.otherUserId}</p>
          <p><b>Last Message:</b> {msg.content}</p>
        </div>
      ))}
    </div>
  );
}

export default ChatList;