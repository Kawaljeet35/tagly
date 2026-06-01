import { useEffect, useState } from "react";
import { useRef } from "react";

export default function ChatWindow({ userId, userName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUsername = localStorage.getItem("username");
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/messages/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        },
      );

      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto p-3 bg-gray-100">
        {messages.map((message) => {
          console.log(message.sender.username);
          const isCurrentUser = message.sender.username === currentUsername;

          return (
            <div
              key={message.id}
              className={`flex mb-5 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  isCurrentUser
                    ? "bg-cyan-500 text-white"
                    : "bg-cyan-200 text-black"
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {message.sender.name}
                </p>

                <p>{message.content}</p>
                <p className="text-xs mt-2 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="p-3 border-t flex gap-2 bg-teal-600">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2 outline-none text-black"
        />

        <button
          onClick={sendMessage}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
