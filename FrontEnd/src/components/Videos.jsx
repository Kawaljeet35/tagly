import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Posts from "./Posts";

export default function Videos({ handleLogout }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState([]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      const videoPosts = data.filter((post) => post.mediaType === "video");

      setVideos(videoPosts);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchVideos();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown date";

    const date = new Date(timestamp);

    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const timeString = date.toLocaleTimeString([], options);
    const dayString = date.toLocaleDateString([], {
      weekday: "long",
    });

    return `${timeString} on ${dayString}`;
  };

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        profilePictureUrl={currentUser?.profilePictureUrl}
      />

      <div className="pt-[58px] pb-[10px]">
        {videos.map((post) => (
          <Posts
            key={post.id}
            id={post.id}
            name={post.name}
            likedByCurrentUser={post.likedByCurrentUser}
            content={post.content}
            createdAt={formatTimestamp(post.createdAt)}
            mediaUrl={post.mediaUrl}
            mediaType={post.mediaType}
            likesCount={post.likesCount}
            commentsCount={post.commentsCount}
            profilePictureUrl={post.profilePictureUrl}
            username={post.username}
            currentUsername={currentUser?.username}
            onDelete={fetchVideos}
          />
        ))}
      </div>
    </>
  );
}
