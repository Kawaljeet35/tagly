import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { id } = useParams();

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const formData = new FormData();

      formData.append("content", newMessage);

      const response = await fetch(`http://localhost:8080/api/messages/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

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
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      <div className="border rounded-lg p-4 h-[500px] overflow-y-auto bg-gray-50 text-black">
        {messages.map((message) => (
          <div key={message.id} className="mb-3">
            <p className="font-semibold">{message.sender.name}</p>

            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 bg-gray-50 p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
