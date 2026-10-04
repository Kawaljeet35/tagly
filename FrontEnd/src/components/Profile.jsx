import Navbar from "./Navbar";
import ProfileTop from "./ProfileTop";
import Posts from "./Posts";
import ChatWindow from "./ChatWindow";
import ProfilePic from "../assets/pic.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile({ handleLogout }) {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState("NONE");
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [myFriends, setMyFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendStatuses, setFriendStatuses] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [minimizedChat, setMinimizedChat] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoComments, setPhotoComments] = useState([]);
  const [showPhotoComments, setShowPhotoComments] = useState(false);
  const [photoCommentText, setPhotoCommentText] = useState("");
  const [hiddenPhotoReplies, setHiddenPhotoReplies] = useState(new Set());
  const [photoReplyingTo, setPhotoReplyingTo] = useState(null);
  const [photoReplyText, setPhotoReplyText] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoComments, setVideoComments] = useState([]);
  const [showVideoComments, setShowVideoComments] = useState(false);
  const [videoCommentText, setVideoCommentText] = useState("");
  const [hiddenVideoReplies, setHiddenVideoReplies] = useState(new Set());
  const [videoReplyingTo, setVideoReplyingTo] = useState(null);
  const [videoReplyText, setVideoReplyText] = useState("");
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
  const navigate = useNavigate();

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

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/requests`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFriends = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/all/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      setFriends(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyFriends = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      setMyFriends(data);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/accept/${requestId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
          `Failed to accept friend request: ${response.status} ${responseText}`,
        );
      }

      await fetchFriendRequests();
      await fetchFriends();
      await fetchMyFriends();
    } catch (error) {
      console.error(error);
    }
  };

  const declineRequest = async (requestId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/decline/${requestId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to decline friend request");
      }

      await fetchFriendRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const unfriend = async (friendshipId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/unfriend/${friendshipId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to unfriend user");
      }

      await fetchFriends();
    } catch (error) {
      console.error(error);
    }
  };

  const getFriendUser = (friend) => {
    const profileOwnerId = user?.id;

    return friend.sender.id === profileOwnerId
      ? friend.receiver
      : friend.sender;
  };

  const isMyFriend = (userId) => {
    return myFriends.some((friendship) => {
      const friendUser =
        friendship.sender.id === currentUser?.id
          ? friendship.receiver
          : friendship.sender;

      return friendUser.id === userId;
    });
  };

  const fetchFriendshipStatuses = async () => {
    if (!currentUser || friends.length === 0) return;

    const statuses = {};

    await Promise.all(
      friends.map(async (friend) => {
        const friendUser = getFriendUser(friend);

        if (!friendUser || friendUser.id === currentUser.id) {
          return;
        }

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/friends/status/${friendUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          if (response.ok) {
            const status = await response.text();

            statuses[friendUser.id] = status;
          }
        } catch (error) {
          console.error("Error fetching friendship status:", error);
        }
      }),
    );

    setFriendStatuses(statuses);
  };

  const sendFriendRequest = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/request/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const responseText = await response.text();

      console.log("Friend request status:", response.status);
      console.log("Friend request response:", responseText);

      if (!response.ok) {
        alert(`Request failed: ${responseText || response.status}`);
        return;
      }

      setSentRequests((prev) => [...prev, Number(userId)]);

      setFriendStatuses((prev) => ({
        ...prev,
        [userId]: "PENDING",
      }));

      alert("Friend request sent");
    } catch (error) {
      console.error("Error sending friend request:", error);

      alert("Something went wrong. Check the browser console.");
    }
  };

  const isOtherUserProfile = user && currentUser && user.id !== currentUser.id;

  const filteredFriends = friends
    .filter((friend) => {
      const friendUser = getFriendUser(friend);

      if (friendUser.id === currentUser?.id) {
        return false;
      }

      return (
        friendUser.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friendUser.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const userA = getFriendUser(a);
      const userB = getFriendUser(b);

      return (userA.name || userA.username || "").localeCompare(
        userB.name || userB.username || "",
        undefined,
        { sensitivity: "base" },
      );
    });

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

  const handlePhotoReply = async (commentId) => {
    if (!photoReplyText.trim()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(photoReplyText),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      setPhotoReplyText("");
      setPhotoReplyingTo(null);

      setSelectedPhoto((prev) => ({
        ...prev,
        commentsCount: prev.commentsCount + 1,
      }));

      await fetchPhotoComments();
    } catch (error) {
      console.error("Error adding photo reply:", error);
    }
  };

  const handlePhotoCommentLike = async (commentId) => {
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

      setPhotoComments((prevComments) =>
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
      console.error("Error liking photo comment:", error);
    }
  };

  const togglePhotoReplies = (commentId) => {
    setHiddenPhotoReplies((prev) => {
      const updated = new Set(prev);

      if (updated.has(commentId)) {
        updated.delete(commentId);
      } else {
        updated.add(commentId);
      }

      return updated;
    });
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

  const handleVideoReply = async (commentId) => {
    if (!videoReplyText.trim()) return;

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
    fetchUser();
    fetchCurrentUser();
    fetchFriendshipStatus();
  }, [id]);

  useEffect(() => {
    if (id || currentUser?.id) {
      fetchPosts();
    }
  }, [id, currentUser]);

  useEffect(() => {
    if (activeTab === "friends" && user?.id) {
      fetchFriendRequests();
      fetchFriends();
      fetchMyFriends();
    }
  }, [activeTab, user?.id]);

  useEffect(() => {
    if (activeTab === "friends") {
      fetchFriendshipStatuses();
    }
  }, [friends, currentUser, activeTab, user?.id]);

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
        {activeTab === "friends" && (
          <>
            {/* Page Header */}
            <div className="pt-2 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300">
                {currentUser?.id === user?.id
                  ? "Your Friends"
                  : `${user?.name}'s Friends`}
              </h1>

              {currentUser?.id === user?.id && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Manage your friend requests and connections
                </p>
              )}
            </div>

            {/* Summary Cards */}
            {!isOtherUserProfile && (
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pending Requests
                  </p>

                  <p className="text-3xl font-bold text-teal-600 mt-1">
                    {requests.length}
                  </p>
                </div>
              </div>
            )}

            {!isOtherUserProfile && (
              <>
                {/* Friend Requests */}
                <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm mb-8 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-300">
                      Friend Requests
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      People who want to connect with you
                    </p>
                  </div>

                  <div className="p-6">
                    {requests.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        You don't have any pending friend requests.
                      </p>
                    ) : (
                      requests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                        >
                          <img
                            src={request.sender.profilePictureUrl || ProfilePic}
                            alt="profile"
                            className="w-14 h-14 rounded-full object-cover"
                          />

                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-gray-300">
                              {request.sender.name}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @{request.sender.username}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptRequest(request.id)}
                              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
                            >
                              Accept
                            </button>

                            <button
                              onClick={() => declineRequest(request.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Friends */}
            <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-300">
                  Friends ({filteredFriends.length})
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {currentUser?.id === user?.id
                    ? "People you're friends with..."
                    : `People ${user?.name?.trim().split(/\s+/)[0]} is friends with...`}
                </p>

                {/* Search Friends */}
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder={
                      currentUser?.id === user?.id
                        ? "Search your friends by name or username..."
                        : `Search ${user?.name?.trim().split(/\s+/)[0] || "their"}'s friends by name or username...`
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    You don't have any friends yet.
                  </p>
                ) : filteredFriends.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No friends found matching your search.
                  </p>
                ) : (
                  filteredFriends.map((friend) => {
                    const friendUser = getFriendUser(friend);

                    return (
                      <div
                        key={friend.id}
                        onClick={() => navigate(`/users/${friendUser.id}`)}
                        className="border border-gray-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex flex-col items-center text-center">
                          <img
                            src={friendUser.profilePictureUrl || ProfilePic}
                            alt="profile"
                            className="w-20 h-20 rounded-full object-cover mb-3"
                          />

                          <p className="font-semibold text-gray-900 dark:text-gray-300">
                            {friendUser.name}
                          </p>

                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{friendUser.username}
                          </p>

                          <div className="flex gap-2 mt-4">
                            {isOtherUserProfile ? (
                              isMyFriend(friendUser.id) ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveChat(friendUser);
                                    setMinimizedChat(false);
                                  }}
                                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                  Message
                                </button>
                              ) : requests.some(
                                  (request) =>
                                    request.sender.id === friendUser.id,
                                ) ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    const request = requests.find(
                                      (request) =>
                                        request.sender.id === friendUser.id,
                                    );

                                    if (request) {
                                      acceptRequest(request.id);
                                    }
                                  }}
                                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                  Accept Request
                                </button>
                              ) : friendStatuses[friendUser.id] === "PENDING" ||
                                sentRequests.includes(friendUser.id) ? (
                                <button
                                  disabled
                                  className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed"
                                >
                                  Request Sent
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sendFriendRequest(friendUser.id);
                                  }}
                                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                  Add Friend
                                </button>
                              )
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveChat(friendUser);
                                    setMinimizedChat(false);
                                  }}
                                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                  Message
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    const confirmed = window.confirm(
                                      `Remove ${friendUser.name} from friends?`,
                                    );

                                    if (confirmed) {
                                      unfriend(friend.id);
                                    }
                                  }}
                                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                  Unfriend
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </>
        )}
      </div>
      {activeChat && (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b bg-teal-600 rounded-t-xl">
            <div
              onClick={() => navigate(`/users/${activeChat.id}`)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={activeChat.profilePictureUrl || ProfilePic}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />

              <h2 className="font-semibold text-white hover:underline">
                {activeChat.name || activeChat.username}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimizedChat((prev) => !prev)}
                className="text-zinc-100 text-l leading-none hover:text-cyan-200"
              >
                —
              </button>

              <button
                onClick={() => setActiveChat(null)}
                className="text-zinc-100 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>

          {!minimizedChat && (
            <ChatWindow
              userId={activeChat.id}
              userName={activeChat.name || activeChat.username}
            />
          )}
        </div>
      )}
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
                    photoComments.map((comment) => {
                      if (
                        comment.parentCommentId &&
                        hiddenPhotoReplies.has(comment.parentCommentId)
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

                                <span className="text-xs text-gray-500 dark:text-gray-400">
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
                                        setPhotoReplyingTo(
                                          photoReplyingTo === comment.id
                                            ? null
                                            : comment.id,
                                        );
                                        setPhotoReplyText("");
                                      }}
                                      className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                                    >
                                      Reply
                                    </button>

                                    {photoComments.some(
                                      (reply) =>
                                        reply.parentCommentId === comment.id,
                                    ) && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          togglePhotoReplies(comment.id)
                                        }
                                        className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                                      >
                                        {hiddenPhotoReplies.has(comment.id)
                                          ? `Show replies (${
                                              photoComments.filter(
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

                              {photoReplyingTo === comment.id &&
                                !comment.parentCommentId && (
                                  <div className="mt-2 space-y-2">
                                    <input
                                      type="text"
                                      value={photoReplyText}
                                      onChange={(e) =>
                                        setPhotoReplyText(e.target.value)
                                      }
                                      placeholder="Write a reply..."
                                      className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-full px-4 py-2 text-sm outline-none"
                                    />

                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handlePhotoReply(comment.id)
                                        }
                                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-sm"
                                      >
                                        Reply
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setPhotoReplyingTo(null);
                                          setPhotoReplyText("");
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
                                  handlePhotoCommentLike(comment.id)
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

                                <span className="text-xs text-gray-500 dark:text-gray-400">
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
