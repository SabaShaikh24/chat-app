import { useState } from "react";
import Login from "./pages/Login";
import ChatList from "./pages/ChatList";
import Chat from "./pages/Chat";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  // 🔁 Navigation logic
  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  if (selectedChat) {
    return (
      <Chat
        conversationId={selectedChat}
        goBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <ChatList
      setIsLoggedIn={setIsLoggedIn}
      openChat={(id) => setSelectedChat(id)}
    />
  );
}

export default App;