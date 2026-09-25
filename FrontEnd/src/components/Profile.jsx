import Navbar from "./Navbar";
import ProfileTop from "./ProfileTop";
import Posts from "./Posts";
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

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        profilePictureUrl={currentUser?.profilePictureUrl}
      />

      <ProfileTop
        name={user?.name}
        profilePictureUrl={user?.profilePictureUrl}
        fetchUser={fetchUser}
        userId={user?.id}
        isOwnProfile={currentUser?.id === user?.id}
        friendshipStatus={friendshipStatus}
        fetchFriendshipStatus={fetchFriendshipStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="max-w-4xl mx-auto mt-8 pb-[10px]">
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
              <div className="w-1/2 h-full bg-white flex flex-col">
                {/* COMMENTS HEADER */}
                <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                  <h3 className="font-semibold text-lg">Comments</h3>

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
                      <div key={comment.id} className="flex gap-4">
                        <img
                          src={comment.user?.profilePictureUrl}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-semibold text-sm text-gray-900">
                            {comment.user?.name || comment.user?.username}
                          </p>

                          <p className="text-sm text-gray-700">
                            {comment.content}
                          </p>
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
                    className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-cyan-500"
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
              <div className="w-1/2 shrink-0 h-full bg-white flex flex-col">
                {/* COMMENTS HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="font-semibold text-gray-900">Comments</h3>

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
                          src={comment.user?.profilePictureUrl}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-semibold text-sm text-gray-900">
                            {comment.user?.name || comment.user?.username}
                          </p>

                          <p className="text-sm text-gray-700">
                            {comment.content}
                          </p>
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
                    className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-cyan-500"
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
    </>
  );
}
