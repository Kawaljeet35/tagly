import CircularTaglyLogo from "/favicon.ico";
import TaglyLogo from "../assets/mainLogoTagly.svg";
import ProfilePic from "../assets/pic.png";
import { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import NavProfilePopUp from "./NavProfilePopUp";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ChatWindow from "./ChatWindow";

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const userId = import.meta.env.VITE_EMAILJS_USER_ID;

export default function Navbar({ handleLogout, profilePictureUrl }) {
  const location = useLocation();
  const [selectedPage, setSelectedPage] = useState("HomePage");
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("idle");
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    position: {},
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [likeNotifications, setLikeNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [commentNotifications, setCommentNotifications] = useState([]);
  const [commentLikeNotifications, setCommentLikeNotifications] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [inboxUsers, setInboxUsers] = useState([]);
  const [unreadChats, setUnreadChats] = useState([]);
  const [previousInboxUsers, setPreviousInboxUsers] = useState([]);
  const [hasSeenNotifications, setHasSeenNotifications] = useState(true);
  const [previousNotificationCount, setPreviousNotificationCount] = useState(0);
  const [activeChats, setActiveChats] = useState([]);
  const [minimizedChats, setMinimizedChats] = useState([]);
  const [activeMobileChatId, setActiveMobileChatId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);

  const navigate = useNavigate();

  const allNotifications = [
    ...pendingRequests.map((request) => ({
      id: `friend-${request.id}`,
      type: "friendRequest",
      user: request.sender,
      createdAt: request.createdAt,
    })),

    ...likeNotifications.map((like) => ({
      id: `like-${like.id}`,
      type: "like",
      user: like.user,
      postId: like.postId,
      createdAt: like.createdAt,
    })),

    ...commentNotifications.map((comment) => ({
      id: `comment-${comment.id}`,
      type: comment.parentCommentId ? "reply" : "comment",
      user: comment.user,
      postId: comment.postId,
      postOwnerId: comment.postOwnerId,
      commentId: comment.id,
      parentCommentId: comment.parentCommentId,
      createdAt: comment.createdAt,
    })),

    ...commentLikeNotifications.map((notification) => ({
      id: `comment-like-${notification.id}`,
      type: "commentLike",
      user: notification.user,
      postId: notification.postId,
      postOwnerId: notification.postOwnerId,
      commentId: notification.commentId,
      parentCommentId: notification.parentCommentId,
      createdAt: notification.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const showTooltip = (text, event) => {
    const tooltipWidth = 100;
    const iconPosition = event.currentTarget.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    let leftPosition = iconPosition.left + iconPosition.width / 2;

    if (leftPosition + tooltipWidth / 2 > screenWidth) {
      leftPosition = screenWidth - tooltipWidth - 10;
    }

    setTooltip({
      visible: true,
      text,
      position: {
        top: iconPosition.top + iconPosition.height + 6,
        left: leftPosition,
      },
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, text: "", position: {} });
  };

  function handlePopUp() {
    setPopUpVisible(!popUpVisible);
  }

  const sendFeedback = (e) => {
    e.preventDefault();

    setFeedbackStatus("sending");

    emailjs
      .sendForm(serviceId, templateId, e.target, userId)
      .then(() => {
        setFeedbackStatus("success");
        setFeedbackText("");
      })
      .catch((error) => {
        console.error("Feedback sending failed:", error);
        setFeedbackStatus("error");
      });
  };

  const fetchPendingRequests = async () => {
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
      setPendingRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLikeNotifications = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/notifications/likes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      setLikeNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCommentNotifications = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/notifications/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      setCommentNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCommentLikeNotifications = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/notifications/comment-likes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        console.error(
          "Failed to fetch comment-like notifications:",
          response.status,
        );
        return;
      }

      const data = await response.json();
      setCommentLikeNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching comment-like notifications:", error);
    }
  };

  const fetchInboxUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/inbox`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      setUnreadChats(
        data
          .filter((user) => user.hasUnreadMessages)
          .map((user) => user.userId),
      );

      if (previousInboxUsers.length > 0) {
        const previousIds = previousInboxUsers.map((user) => user.userId);

        const newUnreadUsers = data.filter(
          (user) => !previousIds.includes(user.userId),
        );

        if (newUnreadUsers.length > 0) {
          setUnreadChats((prev) => [
            ...new Set([...prev, ...newUnreadUsers.map((user) => user.userId)]),
          ]);
        }
      }
      setInboxUsers(Array.isArray(data) ? data : []);
      setPreviousInboxUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const openChat = async (user) => {
    if (window.innerWidth < 768) {
      setMinimizedChats((prev) => {
        const next = new Set(prev);

        if (
          activeMobileChatId &&
          activeMobileChatId !== user.userId &&
          activeChats.some((chat) => chat.userId === activeMobileChatId)
        ) {
          next.add(activeMobileChatId);
        }

        next.delete(user.userId);
        return [...next];
      });

      setActiveMobileChatId(user.userId);
    }
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    let profileData = null;
    let isDeletedUser = false;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user.userId}`,
        { headers },
      );

      if (response.ok) {
        profileData = await response.json();
      } else if (response.status === 404) {
        // Deleted accounts are hidden from profile lookups.
        // Check retained messages to identify a deleted participant.
        const historyResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/messages/${user.userId}`,
          { headers },
        );

        if (historyResponse.ok) {
          const history = await historyResponse.json();

          isDeletedUser =
            Array.isArray(history) &&
            history.some((message) =>
              [message.sender, message.receiver].some(
                (participant) =>
                  Number(participant?.id) === Number(user.userId) &&
                  participant?.accountStatus === "DELETED",
              ),
            );
        }
      }

      setActiveChats((prev) => {
        if (prev.some((chat) => chat.userId === user.userId)) {
          return prev;
        }

        return [
          ...prev,
          {
            ...user,
            name: isDeletedUser
              ? "Deleted User"
              : profileData?.name || user.name || "Chat",
            profilePictureUrl: isDeletedUser
              ? null
              : profileData?.profilePictureUrl || null,
            isDeletedUser,
          },
        ];
      });
    } catch (error) {
      console.error("Error fetching chat user profile:", error);

      setActiveChats((prev) => {
        if (prev.some((chat) => chat.userId === user.userId)) {
          return prev;
        }

        return [
          ...prev,
          {
            ...user,
            isDeletedUser: false,
          },
        ];
      });
    }

    setUnreadChats((prev) => prev.filter((id) => id !== user.userId));

    fetch(`${import.meta.env.VITE_API_URL}/api/messages/read/${user.userId}`, {
      method: "PUT",
      headers,
    });

    setShowMessages(false);
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
      console.error("Error fetching current user:", error);
    }
  };

  const searchUsers = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      const filteredResults = Array.isArray(data)
        ? data.filter((user) => user.id !== currentUser?.id)
        : [];

      setSearchResults(filteredResults);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchLikeNotifications();
    fetchCommentNotifications();
    fetchCommentLikeNotifications();
    fetchInboxUsers();
    fetchCurrentUser();

    const interval = setInterval(() => {
      fetchInboxUsers();
      fetchPendingRequests();
      fetchLikeNotifications();
      fetchCommentNotifications();
      fetchCommentLikeNotifications();
    }, 3000);

    if (location.pathname === "/") {
      setSelectedPage("Home");
    } else if (location.pathname === "/profile") {
      setSelectedPage("Profile");
    } else if (location.pathname === "/discover") {
      setSelectedPage("Discover");
    }

    return () => clearInterval(interval);
  }, [location.pathname]);

  useEffect(() => {
    const currentCount =
      pendingRequests.length +
      likeNotifications.length +
      commentNotifications.length +
      commentLikeNotifications.length;

    if (
      previousNotificationCount > 0 &&
      currentCount > previousNotificationCount
    ) {
      setHasSeenNotifications(false);
      localStorage.setItem("hasSeenNotifications", "false");
    }

    setPreviousNotificationCount(currentCount);
  }, [
    pendingRequests,
    likeNotifications,
    commentNotifications,
    commentLikeNotifications,
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-slate-950 flex items-center gap-2 px-2 py-1 shadow z-10">
      <Link
        to="/"
        className="flex items-center py-2 px-2 sm:px-4 gap-2 hover:scale-105 flex-shrink-0"
      >
        <img src={CircularTaglyLogo} alt="Tagly Logo" className="w-8" />
        <img
          src={TaglyLogo}
          alt="Tagly Main Logo"
          className="hidden sm:block w-20"
        />
      </Link>

      <div className="relative min-w-0 flex-1 md:flex-none md:w-40 lg:w-64">
        <input
          name="search"
          type="text"
          placeholder="Search tagly"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            searchUsers(e.target.value);
          }}
          className="input-default w-full rounded-full px-2 py-1 pl-10 bg-stone-100 dark:bg-slate-800 border-none text-lg text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  navigate(`/users/${user.id}`);
                  setSearchText("");
                  setSearchResults([]);
                }}
                className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <img
                  src={user.profilePictureUrl}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold text-base leading-6">
                    {user.name}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-5">
                    @{user.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Mobile navigation menu */}
      <div className="relative ml-2 flex-shrink-0 md:hidden">
        <button
          type="button"
          onClick={() => setShowMobileMenu((prev) => !prev)}
          aria-label="Open navigation menu"
          aria-expanded={showMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-slate-800"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-gray-700 dark:text-gray-200"
            aria-hidden="true"
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {showMobileMenu && (
          <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <Link
              to="/"
              onClick={() => {
                setSelectedPage("Home");
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
            >
              Home
            </Link>

            <Link
              to="/profile"
              onClick={() => {
                setSelectedPage("Profile");
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
            >
              Profile
            </Link>

            <Link
              to="/discover"
              onClick={() => {
                setSelectedPage("Discover");
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
            >
              Discover
            </Link>

            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowMessages(false);
                setShowMobileMenu(false);
                setHasSeenNotifications(true);
                localStorage.setItem("hasSeenNotifications", "true");
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
            >
              <span>Notifications</span>
              {pendingRequests.length +
                likeNotifications.length +
                commentNotifications.length +
                commentLikeNotifications.length >
                0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {pendingRequests.length +
                    likeNotifications.length +
                    commentNotifications.length +
                    commentLikeNotifications.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMessages((prev) => !prev);
                setShowNotifications(false);
                setShowMobileMenu(false);
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
            >
              <span>Messages</span>
              {unreadChats.length > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {unreadChats.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMobileMenu(false);
                navigate("/account-settings");
              }}
              className="w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
            >
              Account settings
            </button>
          </div>
        )}
      </div>
      {showNotifications && (
        <div className="fixed left-1/2 top-14 z-50 max-h-[70vh] w-[calc(100%-1rem)] max-w-md -translate-x-1/2 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-slate-700">
            <span className="font-semibold text-black dark:text-white">
              Notifications
            </span>

            <button
              type="button"
              onClick={() => setShowNotifications(false)}
              aria-label="Close notifications"
              className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              ×
            </button>
          </div>

          {allNotifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
              No notifications
            </p>
          ) : (
            allNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  setShowNotifications(false);

                  if (
                    notification.type === "commentLike" &&
                    notification.postOwnerId &&
                    notification.postId &&
                    notification.commentId
                  ) {
                    const params = new URLSearchParams({
                      post: notification.postId,
                      comment: notification.commentId,
                      ...(notification.parentCommentId
                        ? { parentComment: notification.parentCommentId }
                        : {}),
                    });

                    navigate(
                      `/users/${notification.postOwnerId}?${params.toString()}`,
                    );
                  } else if (
                    notification.type === "reply" &&
                    notification.postOwnerId &&
                    notification.postId &&
                    notification.commentId &&
                    notification.parentCommentId
                  ) {
                    const params = new URLSearchParams({
                      post: notification.postId,
                      comment: notification.commentId,
                      parentComment: notification.parentCommentId,
                    });

                    navigate(
                      `/users/${notification.postOwnerId}?${params.toString()}`,
                    );
                  } else if (
                    notification.type === "comment" &&
                    notification.postId &&
                    notification.commentId
                  ) {
                    const params = new URLSearchParams({
                      post: notification.postId,
                      comment: notification.commentId,
                    });

                    navigate(
                      `/users/${notification.postOwnerId}?${params.toString()}`,
                    );
                  } else if (
                    notification.type === "like" &&
                    notification.postId
                  ) {
                    navigate(`/profile?post=${notification.postId}`);
                  } else if (
                    notification.type === "friendRequest" &&
                    notification.user?.id
                  ) {
                    navigate(`/users/${notification.user.id}`);
                  }
                }}
                className="flex cursor-pointer items-center gap-2 border-b border-gray-200 p-3 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <img
                  src={notification.user?.profilePictureUrl || ProfilePic}
                  alt=""
                  className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                />

                <p className="text-sm text-black dark:text-gray-200">
                  <span className="font-semibold">
                    {notification.user?.name || notification.user?.username}
                  </span>{" "}
                  {notification.type === "friendRequest"
                    ? "sent you a friend request"
                    : notification.type === "like"
                      ? "liked your post"
                      : notification.type === "reply"
                        ? "replied to your comment"
                        : notification.type === "comment"
                          ? "commented on your post"
                          : notification.type === "commentLike"
                            ? notification.parentCommentId
                              ? "liked your reply"
                              : "liked your comment"
                            : ""}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {showMessages && (
        <div className="fixed left-1/2 top-14 z-50 max-h-[70vh] w-[calc(100%-1rem)] max-w-md -translate-x-1/2 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-slate-700">
            <span className="font-semibold text-black dark:text-white">
              Messages
            </span>

            <button
              type="button"
              onClick={() => setShowMessages(false)}
              aria-label="Close messages"
              className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              ×
            </button>
          </div>

          {inboxUsers.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
              No conversations yet
            </p>
          ) : (
            inboxUsers.map((user) => (
              <div
                key={user.userId}
                onClick={() => openChat(user)}
                className={`flex cursor-pointer items-center gap-3 border-b border-gray-200 p-3 dark:border-slate-700 ${
                  unreadChats.includes(user.userId)
                    ? "bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/50 dark:hover:bg-cyan-900"
                    : "hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                <img
                  src={user.profilePictureUrl || ProfilePic}
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-black dark:text-white">
                    {user.name}
                  </p>

                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {user.latestMessage
                      ? user.latestSenderUsername ===
                        localStorage.getItem("username")
                        ? `You: ${user.latestMessage}`
                        : user.latestMessage
                      : user.latestSenderUsername ===
                          localStorage.getItem("username")
                        ? "You: Photo"
                        : `${user.name} sent you a photo`}
                  </p>
                </div>

                {unreadChats.includes(user.userId) && (
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-teal-600" />
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="hidden md:flex items-center justify-center gap-3 lg:gap-6 mx-auto">
        <Link
          to="/"
          onMouseEnter={(e) => showTooltip("Home", e)}
          onMouseLeave={hideTooltip}
        >
          <div
            className={`p-2 rounded-full ${
              selectedPage === "Home" ? "bg-teal-200" : "bg-stone-200"
            } hover:scale-110`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z"
                  fill="#080341"
                ></path>
              </g>
            </svg>
          </div>
        </Link>

        <Link
          to="/profile"
          onMouseEnter={(e) => showTooltip("Profile", e)}
          onMouseLeave={hideTooltip}
        >
          <div
            className={`p-3 rounded-full ${
              selectedPage === "Profile" ? "bg-teal-200" : "bg-stone-200"
            } hover:scale-110`}
          >
            <svg
              width="150px"
              height="150px"
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="#000000"
              className="w-4 h-4"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Dribbble-Light-Preview"
                    transform="translate(-180.000000, -2159.000000)"
                    fill="#000000"
                  >
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                      <path
                        d="M134,2008.99998 C131.783496,2008.99998 129.980955,2007.20598 129.980955,2004.99998 C129.980955,2002.79398 131.783496,2000.99998 134,2000.99998 C136.216504,2000.99998 138.019045,2002.79398 138.019045,2004.99998 C138.019045,2007.20598 136.216504,2008.99998 134,2008.99998 M137.775893,2009.67298 C139.370449,2008.39598 140.299854,2006.33098 139.958235,2004.06998 C139.561354,2001.44698 137.368965,1999.34798 134.722423,1999.04198 C131.070116,1998.61898 127.971432,2001.44898 127.971432,2004.99998 C127.971432,2006.88998 128.851603,2008.57398 130.224107,2009.67298 C126.852128,2010.93398 124.390463,2013.89498 124.004634,2017.89098 C123.948368,2018.48198 124.411563,2018.99998 125.008391,2018.99998 C125.519814,2018.99998 125.955881,2018.61598 126.001095,2018.10898 C126.404004,2013.64598 129.837274,2010.99998 134,2010.99998 C138.162726,2010.99998 141.595996,2013.64598 141.998905,2018.10898 C142.044119,2018.61598 142.480186,2018.99998 142.991609,2018.99998 C143.588437,2018.99998 144.051632,2018.48198 143.995366,2017.89098 C143.609537,2013.89498 141.147872,2010.93398 137.775893,2009.67298"
                        id="profile-[#1341]"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </Link>

        <Link
          to="/discover"
          onMouseEnter={(e) => showTooltip("Discover", e)}
          onMouseLeave={hideTooltip}
        >
          <div
            className={`p-2 rounded-full ${
              selectedPage === "Discover" ? "bg-teal-200" : "bg-stone-200"
            } hover:scale-110`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>

              <path d="M21 12a9 9 0 1 0 -9 9"></path>

              <path d="M3.6 9h16.8"></path>

              <path d="M3.6 15h7.9"></path>

              <path d="M11.5 3a17 17 0 0 0 0 18"></path>

              <path d="M12.5 3a16.984 16.984 0 0 1 2.574 8.62"></path>

              <path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>

              <path d="M20.2 20.2l1.8 1.8"></path>
            </svg>
          </div>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-3 lg:gap-5 ml-auto mr-2 flex-shrink-0">
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            if (!showNotifications) {
              setHasSeenNotifications(true);
              localStorage.setItem("hasSeenNotifications", "true");
            }
          }}
          onMouseEnter={(e) => showTooltip("Notifications", e)}
          onMouseLeave={hideTooltip}
          className="hidden md:block hover:scale-110 relative"
        >
          {!hasSeenNotifications &&
            pendingRequests.length +
              likeNotifications.length +
              commentNotifications.length +
              commentLikeNotifications.length >
              0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {pendingRequests.length +
                  likeNotifications.length +
                  commentNotifications.length +
                  commentLikeNotifications.length}
              </span>
            )}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M9.00195 17H5.60636C4.34793 17 3.71872 17 3.58633 16.9023C3.4376 16.7925 3.40126 16.7277 3.38515 16.5436C3.37082 16.3797 3.75646 15.7486 4.52776 14.4866C5.32411 13.1835 6.00031 11.2862 6.00031 8.6C6.00031 7.11479 6.63245 5.69041 7.75766 4.6402C8.88288 3.59 10.409 3 12.0003 3C13.5916 3 15.1177 3.59 16.2429 4.6402C17.3682 5.69041 18.0003 7.11479 18.0003 8.6C18.0003 11.2862 18.6765 13.1835 19.4729 14.4866C20.2441 15.7486 20.6298 16.3797 20.6155 16.5436C20.5994 16.7277 20.563 16.7925 20.4143 16.9023C20.2819 17 19.6527 17 18.3943 17H15.0003M9.00195 17L9.00031 18C9.00031 19.6569 10.3435 21 12.0003 21C13.6572 21 15.0003 19.6569 15.0003 18V17M9.00195 17H15.0003"
                stroke="#008080"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </button>
        {showNotifications && (
          <div className="absolute right-0 top-14 w-72 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 z-50">
            <div className="p-3 border-b border-gray-200 dark:border-slate-700 font-semibold text-black dark:text-white">
              Notifications
            </div>

            {allNotifications.length === 0 ? (
              <p className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                No notifications
              </p>
            ) : (
              allNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (
                      notification.type === "commentLike" &&
                      notification.postOwnerId &&
                      notification.postId &&
                      notification.commentId
                    ) {
                      setShowNotifications(false);

                      const params = new URLSearchParams({
                        post: notification.postId,
                        comment: notification.commentId,
                        ...(notification.parentCommentId
                          ? { parentComment: notification.parentCommentId }
                          : {}),
                      });

                      navigate(
                        `/users/${notification.postOwnerId}?${params.toString()}`,
                      );
                      return;
                    }

                    if (
                      notification.type === "reply" &&
                      notification.postOwnerId &&
                      notification.postId &&
                      notification.commentId &&
                      notification.parentCommentId
                    ) {
                      setShowNotifications(false);

                      const params = new URLSearchParams({
                        post: notification.postId,
                        comment: notification.commentId,
                        parentComment: notification.parentCommentId,
                      });

                      navigate(
                        `/users/${notification.postOwnerId}?${params.toString()}`,
                      );

                      return;
                    }

                    if (
                      notification.type === "comment" &&
                      notification.postId &&
                      notification.commentId
                    ) {
                      setShowNotifications(false);

                      const params = new URLSearchParams({
                        post: notification.postId,
                        comment: notification.commentId,
                      });

                      navigate(
                        `/users/${notification.postOwnerId}?${params.toString()}`,
                      );
                      return;
                    }

                    if (notification.type === "like" && notification.postId) {
                      setShowNotifications(false);
                      navigate(`/profile?post=${notification.postId}`);
                      return;
                    }

                    if (
                      notification.type === "friendRequest" &&
                      notification.user?.id
                    ) {
                      setShowNotifications(false);
                      navigate(`/users/${notification.user.id}`);
                    }
                  }}
                  className={`p-3 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 ${
                    ((notification.type === "like" ||
                      notification.type === "comment" ||
                      notification.type === "reply") &&
                      notification.postId) ||
                    (notification.type === "friendRequest" &&
                      notification.user?.id) ||
                    (notification.type === "commentLike" &&
                      notification.postOwnerId &&
                      notification.postId &&
                      notification.commentId)
                      ? "cursor-pointer"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={notification.user?.profilePictureUrl || ProfilePic}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />

                    <p className="text-sm text-black dark:text-gray-200">
                      <span className="font-semibold">
                        {notification.user?.name || notification.user?.username}
                      </span>{" "}
                      {notification.type === "friendRequest"
                        ? "sent you a friend request"
                        : notification.type === "like"
                          ? "liked your post"
                          : notification.type === "reply"
                            ? "replied to your comment"
                            : notification.type === "comment"
                              ? "commented on your post"
                              : notification.type === "commentLike"
                                ? notification.parentCommentId
                                  ? "liked your reply"
                                  : "liked your comment"
                                : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <button
          onClick={() => setShowMessages(!showMessages)}
          onMouseEnter={(e) => showTooltip("Messages", e)}
          onMouseLeave={hideTooltip}
          className="hidden md:block hover:scale-110 relative"
        >
          {unreadChats.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {unreadChats.length}
            </span>
          )}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-8"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g id="Communication / Chat_Dots">
                <path
                  id="Vector"
                  d="M5.59961 19.9203L7.12357 18.7012L7.13478 18.6926C7.45249 18.4384 7.61281 18.3101 7.79168 18.2188C7.95216 18.1368 8.12328 18.0771 8.2998 18.0408C8.49877 18 8.70603 18 9.12207 18H17.8031C18.921 18 19.4806 18 19.908 17.7822C20.2843 17.5905 20.5905 17.2842 20.7822 16.9079C21 16.4805 21 15.9215 21 14.8036V7.19691C21 6.07899 21 5.5192 20.7822 5.0918C20.5905 4.71547 20.2837 4.40973 19.9074 4.21799C19.4796 4 18.9203 4 17.8002 4H6.2002C5.08009 4 4.51962 4 4.0918 4.21799C3.71547 4.40973 3.40973 4.71547 3.21799 5.0918C3 5.51962 3 6.08009 3 7.2002V18.6712C3 19.7369 3 20.2696 3.21846 20.5433C3.40845 20.7813 3.69644 20.9198 4.00098 20.9195C4.35115 20.9191 4.76744 20.5861 5.59961 19.9203Z"
                  stroke="#008080"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </g>
          </svg>
        </button>
        {showMessages && (
          <div className="absolute right-16 top-14 w-72 bg-white dark:bg-slate-900 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 z-50">
            <div className="p-3 border-b border-gray-200 dark:border-slate-700 font-semibold text-black dark:text-white">
              Messages
            </div>

            {inboxUsers.length === 0 ? (
              <p className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                No conversations yet
              </p>
            ) : (
              inboxUsers.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => openChat(user)}
                  className={`flex items-center gap-3 p-3 border-b border-gray-200 dark:border-slate-700 cursor-pointer ${
                    unreadChats.includes(user.userId)
                      ? "bg-cyan-100 dark:bg-cyan-900/50 hover:bg-cyan-200 dark:hover:bg-cyan-900"
                      : "hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <img
                    src={user.profilePictureUrl || ProfilePic}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-black dark:text-white truncate">
                      {user.name}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.latestMessage
                        ? user.latestSenderUsername ===
                          localStorage.getItem("username")
                          ? `You: ${user.latestMessage}`
                          : user.latestMessage
                        : user.latestSenderUsername ===
                            localStorage.getItem("username")
                          ? "You: Photo"
                          : `${user.name} sent you a photo`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="relative">
          <button
            onMouseEnter={(e) => showTooltip("Account", e)}
            onMouseLeave={hideTooltip}
            onClick={handlePopUp}
            className="hover:scale-110 flex items-center"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img
                src={profilePictureUrl || ProfilePic}
                alt="pic"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </button>
          {popUpVisible && (
            <div className="absolute right-0 top-10">
              <NavProfilePopUp
                handleLogout={handleLogout}
                onGiveFeedback={() => {
                  setPopUpVisible(false);
                  setShowFeedback(true);
                }}
                onDisplaySettings={() => {
                  setPopUpVisible(false);
                  setShowDisplaySettings(true);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {tooltip.visible && !popUpVisible && (
        <div
          className="absolute bg-slate-200 text-black shadow font-medium text-sm rounded px-2 py-1"
          style={{
            top: tooltip.position.top,
            left: tooltip.position.left,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.text}
        </div>
      )}

      {showFeedback && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4"
          onClick={() => {
            setShowFeedback(false);
            setFeedbackStatus("idle");
            setFeedbackText("");
          }}
        >
          <div
            className="bg-white dark:bg-slate-900 text-black dark:text-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {feedbackStatus === "success" ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✓</div>

                <h2 className="text-2xl font-bold text-black mb-2">
                  Feedback Sent
                </h2>

                <p className="text-gray-600 mb-6">
                  Thank you for helping us improve Tagly!
                </p>

                <button
                  onClick={() => {
                    setShowFeedback(false);
                    setFeedbackStatus("idle");
                  }}
                  className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-black dark:text-gray-300">
                    Give Feedback
                  </h2>

                  <button
                    onClick={() => {
                      setShowFeedback(false);
                      setFeedbackStatus("idle");
                      setFeedbackText("");
                    }}
                    className="text-gray-500 hover:text-black text-2xl leading-none"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Help us improve Tagly by sharing your thoughts, suggestions,
                  or anything that you think could be better.
                </p>

                <form onSubmit={sendFeedback}>
                  <input
                    type="text"
                    name="sender_name"
                    value={currentUser?.name || ""}
                    readOnly
                    className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200"
                  />

                  <input
                    type="email"
                    name="sender_email"
                    value={currentUser?.email || ""}
                    readOnly
                    className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200"
                  />

                  <textarea
                    name="message"
                    required
                    value={feedbackText}
                    onChange={(e) => {
                      setFeedbackText(e.target.value);
                      if (feedbackStatus === "error") {
                        setFeedbackStatus("idle");
                      }
                    }}
                    placeholder="Tell us what you think..."
                    className="w-full h-32 mb-4 px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />

                  {feedbackStatus === "error" && (
                    <p className="text-red-500 text-sm mb-3">
                      Failed to send feedback. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={feedbackStatus === "sending"}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white py-2.5 rounded-lg font-semibold"
                  >
                    {feedbackStatus === "sending"
                      ? "Sending..."
                      : "Send Feedback"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {showDisplaySettings && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4"
          onClick={() => setShowDisplaySettings(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 text-black dark:text-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-gray-300">
                Display & Accessibility
              </h2>

              <button
                onClick={() => setShowDisplaySettings(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Customize how Tagly looks and feels.
            </p>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-black dark:text-white">
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {darkMode
                    ? "For a lighter appearance across Tagly switch to light mode."
                    : "For a darker appearance across Tagly switch to dark mode."}
                </p>
              </div>

              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`w-12 h-6 rounded-full p-1 transition ${
                  darkMode ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition ${
                    darkMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDisplaySettings(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activeChats.map((chat, index) => {
        const isMobileSelected = activeMobileChatId === chat.userId;

        return (
          <div
            key={chat.userId}
            className={`fixed bottom-4 bg-white border shadow-xl rounded-xl z-50 w-[calc(100vw-1rem)] max-w-80 md:w-80 ${
              isMobileSelected
                ? "block bottom-20 md:bottom-4"
                : "hidden md:block"
            }`}
            style={{
              right: window.innerWidth >= 768 ? `${16 + index * 340}px` : "8px",
            }}
          >
            <div className="flex items-center justify-between p-3 border-b bg-teal-600">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <button
                  type="button"
                  disabled={chat.isDeletedUser}
                  onClick={() => {
                    if (!chat.isDeletedUser && chat.userId) {
                      navigate(`/users/${chat.userId}`);
                    }
                  }}
                  aria-label={`View ${chat.name}'s profile`}
                  className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden p-0 border-0 bg-transparent disabled:cursor-default"
                >
                  <img
                    src={chat.profilePictureUrl || ProfilePic}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </button>

                <button
                  type="button"
                  disabled={chat.isDeletedUser}
                  onClick={() => {
                    if (!chat.isDeletedUser && chat.userId) {
                      navigate(`/users/${chat.userId}`);
                    }
                  }}
                  className="font-semibold text-white truncate text-left hover:underline disabled:no-underline disabled:cursor-default"
                >
                  {chat.name}
                </button>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => {
                    setMinimizedChats((prev) =>
                      prev.includes(chat.userId)
                        ? prev.filter((id) => id !== chat.userId)
                        : [...prev, chat.userId],
                    );

                    if (window.innerWidth < 768) {
                      setActiveMobileChatId(null);
                    }
                  }}
                  aria-label={
                    minimizedChats.includes(chat.userId)
                      ? "Maximize chat"
                      : "Minimize chat"
                  }
                  title={
                    minimizedChats.includes(chat.userId)
                      ? "Maximize chat"
                      : "Minimize chat"
                  }
                  className={`flex h-9 w-8 flex-shrink-0 items-center justify-center text-white hover:text-cyan-200 ${
                    minimizedChats.includes(chat.userId)
                      ? "text-2xl font-bold"
                      : "text-base"
                  }`}
                >
                  {minimizedChats.includes(chat.userId) ? "□" : "—"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveChats((prev) =>
                      prev.filter((c) => c.userId !== chat.userId),
                    );
                    setMinimizedChats((prev) =>
                      prev.filter((id) => id !== chat.userId),
                    );

                    if (activeMobileChatId === chat.userId) {
                      setActiveMobileChatId(null);
                    }
                  }}
                  aria-label="Close chat"
                  className="flex h-9 w-6 flex-shrink-0 items-center justify-center text-xl text-zinc-100 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            </div>

            {!minimizedChats.includes(chat.userId) && (
              <ChatWindow
                userId={chat.userId}
                userName={chat.name}
                isDeletedUser={chat.isDeletedUser}
              />
            )}
          </div>
        );
      })}

      {/* Mobile conversation switcher */}
      {activeChats.length > 0 && (
        <div className="fixed bottom-2 right-2 left-2 z-[60] flex flex-row-reverse justify-start gap-2 overflow-x-auto md:hidden">
          {activeChats
            .filter((chat) => minimizedChats.includes(chat.userId))
            .map((chat) => {
              const isSelected = activeMobileChatId === chat.userId;

              return (
                <button
                  key={chat.userId}
                  type="button"
                  onClick={() => {
                    setMinimizedChats((prev) => {
                      const next = new Set(prev);

                      if (
                        activeMobileChatId &&
                        activeMobileChatId !== chat.userId &&
                        activeChats.some(
                          (item) => item.userId === activeMobileChatId,
                        )
                      ) {
                        next.add(activeMobileChatId);
                      }

                      next.delete(chat.userId);
                      return [...next];
                    });

                    setActiveMobileChatId(chat.userId);
                  }}
                  className={`flex min-w-0 max-w-40 flex-shrink-0 items-center gap-2 rounded-full border px-3 py-2 shadow ${
                    isSelected
                      ? "border-teal-700 bg-teal-700 text-white"
                      : "border-gray-300 bg-white text-gray-800"
                  }`}
                >
                  <img
                    src={chat.profilePictureUrl || ProfilePic}
                    alt=""
                    className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
                  />
                  <span className="truncate text-sm font-medium">
                    {chat.name}
                  </span>
                </button>
              );
            })}
        </div>
      )}
    </nav>
  );
}
