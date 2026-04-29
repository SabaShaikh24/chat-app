import { useEffect, useState, useRef } from "react";
import supabase from "../lib/supabaseClient";

function Chat({ conversationId, goBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const bottomRef = useRef();

  // ❌ safety check
  if (!conversationId) return <div>No chat selected</div>;

  // ✅ Get logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id);
    };
    getUser();
  }, []);

  // ✅ Fetch messages + realtime
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.conversation_id === conversationId) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // ✅ Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at");

    if (!error) setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      content: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={goBack}>Back</button>
      <h2>Chat</h2>

      {/* 💬 Messages */}
      <div style={{ minHeight: "300px" }}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === userId;

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                margin: "5px",
              }}
            >
              <div
                style={{
                  background: isMe ? "#4CAF50" : "#333",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  maxWidth: "60%",
                }}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {/* 👇 Auto scroll anchor */}
        <div ref={bottomRef}></div>
      </div>

      {/* ✍️ Input */}
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Type message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ padding: "5px", width: "70%" }}
        />

        <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;