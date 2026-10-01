import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import ChatWindow from "./ChatWindow";
import ProfilePic from "../assets/pic.png";

export default function Messages({ handleLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [minimized, setMinimized] = useState(false);
  const [userName, setUserName] = useState("Chat");
  const [userProfilePicture, setUserProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUserName(data.name || data.username || "Chat");
        setUserProfilePicture(data.profilePictureUrl || null);
      } catch (error) {
        console.error("Error fetching message user:", error);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <>
      <Navbar handleLogout={handleLogout} />

      <div className="fixed bottom-4 right-4 z-50 w-80 bg-white border shadow-xl rounded-xl">
        <div className="flex items-center justify-between p-3 border-b bg-teal-600 rounded-t-xl">
          <div
            onClick={() => navigate(`/users/${id}`)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src={userProfilePicture || ProfilePic}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />

            <h2 className="font-semibold text-white hover:underline">
              {userName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMinimized((prev) => !prev)}
              className="text-zinc-100 text-l leading-none hover:text-cyan-200"
            >
              —
            </button>

            <button
              onClick={() => navigate(-1)}
              className="text-zinc-100 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </div>

        {!minimized && <ChatWindow userId={Number(id)} userName={userName} />}
      </div>
    </>
  );
}
