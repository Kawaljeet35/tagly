import { useEffect, useState } from "react";
import ProfilePic from "../assets/pic.png";
import Navbar from "./Navbar";

export default function DiscoverPage({ handleLogout }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoComments, setVideoComments] = useState([]);
  const [showVideoComments, setShowVideoComments] = useState(false);
  const [videoCommentText, setVideoCommentText] = useState("");

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

    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === selectedVideo.id
          ? {
              ...video,
              likedByCurrentUser: !video.likedByCurrentUser,
              likesCount: video.likedByCurrentUser
                ? video.likesCount - 1
                : video.likesCount + 1,
            }
          : video,
      ),
    );
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

    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === selectedVideo.id
          ? {
              ...video,
              commentsCount: video.commentsCount + 1,
            }
          : video,
      ),
    );
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchVideos();
  }, []);

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        profilePictureUrl={currentUser?.profilePictureUrl}
      />

      <div className="pt-[58px] pb-[10px] px-2">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {videos.map((post) => (
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
                      post.likedByCurrentUser ? "text-red-500" : "text-white"
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
      </div>
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
                          src={comment.user?.profilePictureUrl || ProfilePic}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <p className="font-semibold text-sm text-gray-900">
                              {comment.user?.name || comment.user?.username}
                            </p>

                            <span className="text-xs text-gray-500">
                              {formatCommentTimestamp(comment.createdAt)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 break-words mt-0.5">
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
