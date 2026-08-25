import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import CreatePost from "./CreatePost";
import AddStory from "./AddStory";
import Posts from "./Posts";
import UploadOverlay from "./UploadOverlay";

export default function Home({ handleLogout }) {
  const [isUploadVisible, setUploadVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const handleUploadClick = () => {
    setUploadVisible(true);
  };

  const closeUpload = () => {
    setUploadVisible(false);
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      console.log("Fetching posts...");
      setPosts([...data]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchUser = async () => {
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

      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown date"; // Handle undefined case
    const date = new Date(timestamp); // Use the ISO format directly
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const timeString = date.toLocaleTimeString([], options);
    const dayString = date.toLocaleDateString([], { weekday: "long" });
    return `${timeString} on ${dayString}`; // Combine time and day
  };

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        profilePictureUrl={user?.profilePictureUrl}
      />
      <AddStory />
      <CreatePost
        handleUploadClick={handleUploadClick}
        onPostCreated={fetchPosts}
        profilePictureUrl={user?.profilePictureUrl}
      />
      {isUploadVisible && (
        <UploadOverlay closeUpload={closeUpload} onPostCreated={fetchPosts} />
      )}
      {posts.map((post, index) => {
        return (
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
            currentUsername={user?.username}
            onDelete={fetchPosts}
          />
        );
      })}
    </>
  );
}
