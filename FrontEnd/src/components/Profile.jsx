import Navbar from "./Navbar";
import ProfileTop from "./ProfileTop";
import Posts from "./Posts";
import ProfilePic from "../assets/pic.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile({ handleLogout }) {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState("NONE");
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoComments, setPhotoComments] = useState([]);
  const [showPhotoComments, setShowPhotoComments] = useState(false);
  const [photoCommentText, setPhotoCommentText] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoComments, setVideoComments] = useState([]);
  const [showVideoComments, setShowVideoComments] = useState(false);
  const [videoCommentText, setVideoCommentText] = useState("");
  const [isNameEditOpen, setIsNameEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [nameUpdateLoading, setNameUpdateLoading] = useState(false);
  const [isBioEditOpen, setIsBioEditOpen] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [bioUpdateLoading, setBioUpdateLoading] = useState(false);
  const [isLocationEditOpen, setIsLocationEditOpen] = useState(false);
  const [editLocation, setEditLocation] = useState("");
  const [locationUpdateLoading, setLocationUpdateLoading] = useState(false);

  const { id } = useParams();

  const fetchUser = async () => {
    try {
      const response = await fetch(
        id
          ? `${import.meta.env.VITE_API_URL}/api/users/${id}`
          : `${import.meta.env.VITE_API_URL}/api/users/me`,
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

  const fetchFriendshipStatus = async () => {
    if (!id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/status/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.text();

      setFriendshipStatus(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const endpoint = id
        ? `${import.meta.env.VITE_API_URL}/api/posts/user/${id}`
        : `${import.meta.env.VITE_API_URL}/api/posts/user/${currentUser?.id}`;

      if (!id && !currentUser?.id) {
        return;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      setPosts(data);
    } catch (error) {
      console.error("Error fetching profile posts:", error);
    }
  };

  const handleNameUpdate = async () => {
    if (!editName.trim()) {
      alert("Name cannot be empty");
      return;
    }

    setNameUpdateLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: editName.trim(),
            bio: user?.bio || "",
            location: user?.location || "",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update name");
      }

      await fetchUser();
      await fetchCurrentUser();

      setIsNameEditOpen(false);
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name");
    } finally {
      setNameUpdateLoading(false);
    }
  };

  const handleBioUpdate = async () => {
    setBioUpdateLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: user?.name || "",
            bio: editBio.trim(),
            location: user?.location || "",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update bio");
      }

      await fetchUser();
      await fetchCurrentUser();

      setIsBioEditOpen(false);
    } catch (error) {
      console.error("Error updating bio:", error);
      alert("Failed to update bio");
    } finally {
      setBioUpdateLoading(false);
    }
  };

  const handleLocationUpdate = async () => {
    setLocationUpdateLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: user?.name || "",
            bio: user?.bio || "",
            location: editLocation.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update location");
      }

      await fetchUser();
      await fetchCurrentUser();

      setIsLocationEditOpen(false);
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location");
    } finally {
      setLocationUpdateLoading(false);
    }
  };

  const handlePhotoLike = async () => {
    if (!selectedPhoto) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${selectedPhoto.id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      setSelectedPhoto((prev) => ({
        ...prev,
        likedByCurrentUser: !prev.likedByCurrentUser,
        likesCount: prev.likedByCurrentUser
          ? prev.likesCount - 1
          : prev.likesCount + 1,
      }));

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPhoto.id
            ? {
                ...post,
                likedByCurrentUser: !post.likedByCurrentUser,
                likesCount: post.likedByCurrentUser
                  ? post.likesCount - 1
                  : post.likesCount + 1,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Error toggling photo like:", error);
    }
  };

  const handleVideoLike = async () => {
    if (!selectedVideo) return;

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/posts/${selectedVideo.id}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to like video");
      return;
    }

    setSelectedVideo((prev) => ({
      ...prev,
      likedByCurrentUser: !prev.likedByCurrentUser,
      likesCount: prev.likedByCurrentUser
        ? prev.likesCount - 1
        : prev.likesCount + 1,
    }));

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === selectedVideo.id
          ? {
              ...post,
              likedByCurrentUser: !post.likedByCurrentUser,
              likesCount: post.likedByCurrentUser
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post,
      ),
    );
  };

  const fetchPhotoComments = async () => {
    if (!selectedPhoto) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${selectedPhoto.id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();

      setPhotoComments(data);
      setShowPhotoComments(true);
    } catch (error) {
      console.error("Error fetching photo comments:", error);
    }
  };

  const fetchVideoComments = async () => {
    if (!selectedVideo) return;

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/posts/${selectedVideo.id}/comments`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch video comments");
      return;
    }

    const data = await response.json();

    setVideoComments(data);
    setShowVideoComments(true);
  };

  const handlePhotoComment = async () => {
    if (!photoCommentText.trim() || !selectedPhoto) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${selectedPhoto.id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(photoCommentText),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      setPhotoCommentText("");

      await fetchPhotoComments();

      setSelectedPhoto((prev) => ({
        ...prev,
        commentsCount: prev.commentsCount + 1,
      }));

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPhoto.id
            ? {
                ...post,
                commentsCount: post.commentsCount + 1,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Error adding photo comment:", error);
    }
  };

  const handleVideoComment = async () => {
    if (!videoCommentText.trim() || !selectedVideo) return;

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/posts/${selectedVideo.id}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(videoCommentText),
      },
    );

    if (!response.ok) {
      console.error("Failed to post video comment");
      return;
    }

    setVideoCommentText("");

    await fetchVideoComments();

    setSelectedVideo((prev) => ({
      ...prev,
      commentsCount: prev.commentsCount + 1,
    }));

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === selectedVideo.id
          ? {
              ...post,
              commentsCount: post.commentsCount + 1,
            }
          : post,
      ),
    );
  };

  useEffect(() => {
    fetchUser();
    fetchCurrentUser();
    fetchFriendshipStatus();
  }, [id]);

  useEffect(() => {
    if (id || currentUser?.id) {
      fetchPosts();
    }
  }, [id, currentUser]);

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

  const formatCommentTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInSeconds = Math.floor(
      (now.getTime() - commentDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) {
      return "now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMonths < 12) {
      return `${diffInMonths}mo`;
    }

    const diffInYears = Math.floor(diffInDays / 365);

    return `${diffInYears}y`;
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-slate-800">
      <Navbar
        handleLogout={handleLogout}
        profilePictureUrl={currentUser?.profilePictureUrl}
      />

      <ProfileTop
        name={user?.name}
        profilePictureUrl={user?.profilePictureUrl}
        coverPhotoUrl={user?.coverPhotoUrl}
        fetchUser={fetchUser}
        userId={user?.id}
        isOwnProfile={currentUser?.id === user?.id}
        friendshipStatus={friendshipStatus}
        fetchFriendshipStatus={fetchFriendshipStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="max-w-4xl mx-auto mt-3 pb-[10px]">
        {activeTab === "posts" && (
          <>
            {posts.map((post) => (
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
                commentedByCurrentUser={post.commentedByCurrentUser}
                sharesCount={post.sharesCount}
                profilePictureUrl={post.profilePictureUrl}
                username={post.username}
                currentUsername={currentUser?.username}
                onDelete={fetchPosts}
              />
            ))}
          </>
        )}

        {activeTab === "photos" && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {posts
              .filter((post) => post.mediaType === "image")
              .map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPhoto(post)}
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                >
                  <img
                    src={post.mediaUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200">
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span
                        className={
                          post.likedByCurrentUser
                            ? "text-red-500"
                            : "text-white"
                        }
                      >
                        ♥
                      </span>
                      <span>{post.likesCount}</span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-white">💬</span>
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "videos" && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {posts
              .filter((post) => post.mediaType === "video")
              .map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedVideo(post)}
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-black"
                >
                  <video
                    src={post.mediaUrl}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200">
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span
                        className={
                          post.likedByCurrentUser
                            ? "text-red-500"
                            : "text-white"
                        }
                      >
                        ♥
                      </span>
                      <span>{post.likesCount}</span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-white">💬</span>
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white dark:bg-slate-900 text-black dark:text-gray-200 rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">About</h2>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Name
                    </p>
                    <p className="text-lg font-medium text-black dark:text-gray-200">
                      {user?.name || "Not provided"}
                    </p>
                  </div>

                  {currentUser?.id === user?.id && (
                    <button
                      onClick={() => {
                        setEditName(user?.name || "");
                        setIsNameEditOpen(true);
                      }}
                      className="text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-md flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 20H8L19.5 8.5C20.3284 7.67157 20.3284 6.32843 19.5 5.5C18.6716 4.67157 17.3284 4.67157 16.5 5.5L5 17V20Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 7L17 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <span className="text-base font-medium">Edit</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Username
                </p>
                <p className="text-lg font-medium text-black dark:text-gray-200">
                  @{user?.username}
                </p>
              </div>

              {user?.email && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-lg font-medium text-black dark:text-gray-200">
                    {user.email}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Birthday
                </p>
                <p className="text-lg font-medium text-black dark:text-gray-200">
                  {user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString([], {
                        day: "numeric",
                        month: "long",
                      })
                    : "Not provided"}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Bio
                    </p>
                    <p className="text-lg font-medium text-black dark:text-gray-200">
                      {user?.bio || "No bio added"}
                    </p>
                  </div>

                  {currentUser?.id === user?.id && (
                    <button
                      onClick={() => {
                        setEditBio(user?.bio || "");
                        setIsBioEditOpen(true);
                      }}
                      className="text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-md flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 20H8L19.5 8.5C20.3284 7.67157 20.3284 6.32843 19.5 5.5C18.6716 4.67157 17.3284 4.67157 16.5 5.5L5 17V20Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 7L17 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-base font-medium">Edit</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="text-lg font-medium text-black dark:text-gray-200">
                      {user?.location || "Not provided"}
                    </p>
                  </div>

                  {currentUser?.id === user?.id && (
                    <button
                      onClick={() => {
                        setEditLocation(user?.location || "");
                        setIsLocationEditOpen(true);
                      }}
                      className="text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-md flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 20H8L19.5 8.5C20.3284 7.67157 20.3284 6.32843 19.5 5.5C18.6716 4.67157 17.3284 4.67157 16.5 5.5L5 17V20Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 7L17 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-base font-medium">Edit</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Joined Tagly
                </p>
                <p className="text-lg font-medium text-black dark:text-gray-200">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString([], {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not provided"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className={
              showPhotoComments
                ? "relative w-full max-w-6xl h-[85vh] bg-black rounded-lg overflow-hidden flex"
                : "relative max-w-5xl max-h-[90vh]"
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* PHOTO SECTION */}
            <div
              className={
                showPhotoComments
                  ? "w-1/2 h-full bg-black flex items-center justify-center relative overflow-hidden"
                  : "relative"
              }
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={selectedPhoto.mediaUrl}
                  alt=""
                  className={
                    showPhotoComments
                      ? "max-w-[95%] max-h-[95%] object-contain"
                      : "max-w-full max-h-[85vh] object-contain rounded-lg"
                  }
                />
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl z-10"
              >
                ✕
              </button>

              {/* LIKE + COMMENT CONTROLS */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                <button
                  onClick={handlePhotoLike}
                  className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-full transition-colors"
                >
                  <span
                    className={
                      selectedPhoto.likedByCurrentUser
                        ? "text-red-500"
                        : "text-white"
                    }
                  >
                    ♥
                  </span>

                  <span>{selectedPhoto.likesCount}</span>
                </button>

                <button
                  onClick={fetchPhotoComments}
                  className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-full transition-colors"
                >
                  <span>💬</span>
                  <span>{selectedPhoto.commentsCount}</span>
                </button>
              </div>
            </div>

            {/* COMMENTS SECTION */}
            {showPhotoComments && (
              <div className="w-1/2 h-full bg-white dark:bg-slate-900 text-black dark:text-gray-200 flex flex-col">
                {/* COMMENTS HEADER */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
                  <h3 className="font-semibold text-lg text-black dark:text-gray-300">
                    Comments
                  </h3>

                  <button
                    onClick={() => setShowPhotoComments(false)}
                    className="text-gray-500 hover:text-black text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* SCROLLABLE COMMENTS */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {photoComments.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">
                      No comments yet.
                    </p>
                  ) : (
                    photoComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img
                          src={comment.user?.profilePictureUrl || ProfilePic}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <p className="font-semibold text-sm text-gray-900 dark:text-gray-300">
                              {comment.user?.name || comment.user?.username}
                            </p>

                            <span className="text-xs text-gray-500">
                              {formatCommentTimestamp(comment.createdAt)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 dark:text-gray-200 break-words mt-0.5">
                            {comment.content}
                          </p>

                          <button
                            type="button"
                            className="text-xs font-semibold text-gray-500 hover:text-gray-800 mt-1"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* COMMENT INPUT */}
                <div className="border-t p-3 flex gap-2 flex-shrink-0">
                  <input
                    type="text"
                    value={photoCommentText}
                    onChange={(e) => setPhotoCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-cyan-500"
                  />

                  <button
                    onClick={handlePhotoComment}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className={
              showVideoComments
                ? "relative w-full max-w-6xl h-[85vh] bg-black rounded-lg overflow-hidden flex"
                : "relative max-w-5xl max-h-[90vh]"
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* VIDEO SECTION */}
            <div
              className={
                showVideoComments
                  ? "w-1/2 shrink-0 h-full bg-black flex items-center justify-center relative overflow-hidden"
                  : "relative"
              }
            >
              {/* MAIN VIDEO CLOSE BUTTON */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl z-30"
              >
                ✕
              </button>
              <video
                src={selectedVideo.mediaUrl}
                controls
                autoPlay
                className={
                  showVideoComments
                    ? "max-w-[95%] max-h-[95%] object-contain"
                    : "max-w-full max-h-[85vh] object-contain rounded-lg"
                }
              />

              {/* LIKE + COMMENT CONTROLS */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                <button
                  onClick={handleVideoLike}
                  className="flex items-center gap-2 bg-black/60 hover:bg-black/80 px-3 py-2 rounded-lg"
                >
                  <span
                    className={
                      selectedVideo.likedByCurrentUser
                        ? "text-red-500"
                        : "text-white"
                    }
                  >
                    ♥
                  </span>

                  <span>{selectedVideo.likesCount}</span>
                </button>

                <button
                  onClick={fetchVideoComments}
                  className="flex items-center gap-2 bg-black/60 hover:bg-black/80 px-3 py-2 rounded-lg"
                >
                  <span>💬</span>
                  <span>{selectedVideo.commentsCount}</span>
                </button>
              </div>
            </div>

            {/* COMMENTS SECTION */}
            {showVideoComments && (
              <div className="w-1/2 shrink-0 h-full bg-white dark:bg-slate-900 text-black dark:text-gray-200 flex flex-col">
                {/* COMMENTS HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-300">
                    Comments
                  </h3>

                  <button
                    onClick={() => setShowVideoComments(false)}
                    className="text-gray-500 hover:text-gray-800 text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* COMMENTS */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {videoComments.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">
                      No comments yet.
                    </p>
                  ) : (
                    videoComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img
                          src={comment.user?.profilePictureUrl || ProfilePic}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <p className="font-semibold text-sm text-gray-900 dark:text-gray-300">
                              {comment.user?.name || comment.user?.username}
                            </p>

                            <span className="text-xs text-gray-500">
                              {formatCommentTimestamp(comment.createdAt)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 dark:text-gray-200 break-words mt-0.5">
                            {comment.content}
                          </p>

                          <button
                            type="button"
                            className="text-xs font-semibold text-gray-500 hover:text-gray-800 mt-1"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* COMMENT INPUT */}
                <div className="border-t p-3 flex gap-2 flex-shrink-0">
                  <input
                    type="text"
                    value={videoCommentText}
                    onChange={(e) => setVideoCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-cyan-500"
                  />

                  <button
                    onClick={handleVideoComment}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isNameEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 text-black dark:text-gray-200 rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit Name</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your name"
            />

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => !nameUpdateLoading && setIsNameEditOpen(false)}
                disabled={nameUpdateLoading}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleNameUpdate}
                disabled={nameUpdateLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  nameUpdateLoading
                    ? "bg-gray-400"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {nameUpdateLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isBioEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 text-black dark:text-gray-200 rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit Bio</h2>

            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Tell people something about yourself"
            />

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => !bioUpdateLoading && setIsBioEditOpen(false)}
                disabled={bioUpdateLoading}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleBioUpdate}
                disabled={bioUpdateLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  bioUpdateLoading
                    ? "bg-gray-400"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {bioUpdateLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isLocationEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 text-black dark:text-gray-200 rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit Location</h2>

            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your location"
            />

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() =>
                  !locationUpdateLoading && setIsLocationEditOpen(false)
                }
                disabled={locationUpdateLoading}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleLocationUpdate}
                disabled={locationUpdateLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  locationUpdateLoading
                    ? "bg-gray-400"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {locationUpdateLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
