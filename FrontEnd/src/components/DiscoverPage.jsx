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
  const [hiddenVideoReplies, setHiddenVideoReplies] = useState(new Set());
  const [videoReplyingTo, setVideoReplyingTo] = useState(null);
  const [videoReplyText, setVideoReplyText] = useState("");

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
        `${import.meta.env.VITE_API_URL}/api/posts/discover`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      setVideos(data);
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

  const handleVideoReply = async (commentId) => {
    if (!videoReplyText.trim() || !selectedVideo) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(videoReplyText),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      setVideoReplyText("");
      setVideoReplyingTo(null);

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

      await fetchVideoComments();
    } catch (error) {
      console.error("Error adding video reply:", error);
    }
  };

  const handleVideoCommentLike = async (commentId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to like comment");
      }

      setVideoComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id !== commentId) {
            return comment;
          }

          const liked = !comment.likedByCurrentUser;

          return {
            ...comment,
            likedByCurrentUser: liked,
            likesCount: liked
              ? comment.likesCount + 1
              : Math.max(0, comment.likesCount - 1),
          };
        }),
      );
    } catch (error) {
      console.error("Error liking video comment:", error);
    }
  };

  const toggleVideoReplies = (commentId) => {
    setHiddenVideoReplies((prev) => {
      const updated = new Set(prev);

      if (updated.has(commentId)) {
        updated.delete(commentId);
      } else {
        updated.add(commentId);
      }

      return updated;
    });
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

      <div className="pt-[68px] pb-[10px] px-4 bg-stone-100 dark:bg-slate-800 min-h-screen">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-6xl mx-auto">
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
              <div className="w-1/2 shrink-0 h-full bg-white dark:bg-slate-900 text-black dark:text-gray-200 flex flex-col">
                {/* COMMENTS HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-300">
                    Comments
                  </h3>

                  <button
                    onClick={() => setShowVideoComments(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-xl"
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
                    videoComments.map((comment) => {
                      if (
                        comment.parentCommentId &&
                        hiddenVideoReplies.has(comment.parentCommentId)
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={comment.id}
                          className={`flex gap-3 ${
                            comment.parentCommentId ? "ml-10" : ""
                          }`}
                        >
                          <img
                            src={comment.user?.profilePictureUrl || ProfilePic}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0 flex justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <p className="font-semibold text-sm text-gray-900 dark:text-gray-300">
                                  {comment.user?.name || comment.user?.username}
                                </p>

                                <span className="text-xs text-gray-500 dark:text-gray-300">
                                  {formatCommentTimestamp(comment.createdAt)}
                                </span>
                              </div>

                              <p className="text-sm text-gray-700 dark:text-gray-200 break-words mt-0.5">
                                {comment.content}
                              </p>

                              <div className="flex items-center gap-3 mt-1">
                                {!comment.parentCommentId && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVideoReplyingTo(
                                          videoReplyingTo === comment.id
                                            ? null
                                            : comment.id,
                                        );
                                        setVideoReplyText("");
                                      }}
                                      className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                                    >
                                      Reply
                                    </button>

                                    {videoComments.some(
                                      (reply) =>
                                        reply.parentCommentId === comment.id,
                                    ) && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleVideoReplies(comment.id)
                                        }
                                        className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                                      >
                                        {hiddenVideoReplies.has(comment.id)
                                          ? `Show replies (${
                                              videoComments.filter(
                                                (reply) =>
                                                  reply.parentCommentId ===
                                                  comment.id,
                                              ).length
                                            })`
                                          : "Hide replies"}
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>

                              {videoReplyingTo === comment.id &&
                                !comment.parentCommentId && (
                                  <div className="mt-2 space-y-2">
                                    <input
                                      type="text"
                                      value={videoReplyText}
                                      onChange={(e) =>
                                        setVideoReplyText(e.target.value)
                                      }
                                      placeholder="Write a reply..."
                                      className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-full px-4 py-2 text-sm outline-none"
                                    />

                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleVideoReply(comment.id)
                                        }
                                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-sm"
                                      >
                                        Reply
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setVideoReplyingTo(null);
                                          setVideoReplyText("");
                                        }}
                                        className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 text-sm"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center pt-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleVideoCommentLike(comment.id)
                                }
                                className={`hover:scale-110 transition-transform ${
                                  comment.likedByCurrentUser
                                    ? "text-red-500"
                                    : "text-gray-400 hover:text-red-400"
                                }`}
                                aria-label="Like comment"
                              >
                                <svg
                                  className="w-5 h-5"
                                  viewBox="0 0 24 24"
                                  fill={
                                    comment.likedByCurrentUser
                                      ? "currentColor"
                                      : "none"
                                  }
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.8 8.7C20.8 5.7 18.4 3.5 15.5 3.5C13.8 3.5 12.3 4.3 11.4 5.6C10.5 4.3 9 3.5 7.3 3.5C4.4 3.5 2 5.7 2 8.7C2 12.4 5.2 15.1 11.4 20.1C11.6 20.3 11.9 20.3 12.1 20.1C18.3 15.1 20.8 12.4 20.8 8.7Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>

                              {comment.likesCount > 0 && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                  {comment.likesCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* COMMENT INPUT */}
                <div className="border-t border-gray-200 dark:border-slate-700 p-3 flex gap-2 flex-shrink-0">
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
    </>
  );
}
