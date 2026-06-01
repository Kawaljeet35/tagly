import CircularTaglyLogo from "/favicon.ico";
import TaglyLogo from "../assets/mainLogoTagly.svg";
import ProfilePic from "../assets/pic.png";
import { useState, useEffect } from "react";
import NavProfilePopUp from "./NavProfilePopUp";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ChatWindow from "./ChatWindow";

export default function Navbar({ handleLogout, profilePictureUrl }) {
  const location = useLocation();
  const [selectedPage, setSelectedPage] = useState("HomePage");
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    position: {},
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [likeNotifications, setLikeNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [commentNotifications, setCommentNotifications] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [inboxUsers, setInboxUsers] = useState([]);
  const [unreadChats, setUnreadChats] = useState([]);
  const [previousInboxUsers, setPreviousInboxUsers] = useState([]);
  const [hasSeenNotifications, setHasSeenNotifications] = useState(
    localStorage.getItem("hasSeenNotifications") === "true",
  );
  const [activeChats, setActiveChats] = useState([]);
  const [minimizedChats, setMinimizedChats] = useState([]);
  const navigate = useNavigate();

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

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/friends/requests",
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
        "http://localhost:8080/api/posts/notifications/likes",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      console.log("LIKE DATA:", data);
      setLikeNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCommentNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/posts/notifications/comments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      console.log("COMMENT DATA:", data);
      setCommentNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInboxUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/messages/inbox", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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

  useEffect(() => {
    fetchPendingRequests();
    fetchLikeNotifications();
    fetchCommentNotifications();
    fetchInboxUsers();

    const interval = setInterval(() => {
      fetchInboxUsers();
    }, 3000);

    if (location.pathname === "/") {
      setSelectedPage("Home");
    } else if (location.pathname === "/profile") {
      setSelectedPage("Profile");
    } else if (location.pathname === "/videos") {
      setSelectedPage("Videos");
    } else if (location.pathname === "/friends") {
      setSelectedPage("Friends");
    }

    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 w-full bg-white flex items-center px-2 py-1 shadow z-10">
      <a
        href=""
        className="flex items-center py-2 px-4 gap-2 hover:scale-110 flex-shrink-0"
        onClick={(e) => e.preventDefault()}
      >
        <img src={CircularTaglyLogo} alt="Tagly Logo" className="w-8" />
        <img src={TaglyLogo} alt="Tagly Main Logo" className="w-20" />
      </a>

      <div className="relative">
        <input
          name="search"
          type="text"
          placeholder="Search tagly"
          className="input-default rounded-full px-2 py-1 pl-10 bg-stone-100 border-none text-lg"
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
        <Link to="/users" className="ml-4 text-teal-700 font-semibold">
          Users
        </Link>
      </div>

      <div className="justify-center items-center ml-12 space-x-4 hidden lg:flex">
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
          to="/videos"
          onMouseEnter={(e) => showTooltip("Videos", e)}
          onMouseLeave={hideTooltip}
        >
          <div
            className={`p-2 rounded-full ${
              selectedPage === "Videos" ? "bg-teal-200" : "bg-stone-200"
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
                  d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </div>
        </Link>

        <Link
          to="/friends"
          onMouseEnter={(e) => showTooltip("Friends", e)}
          onMouseLeave={hideTooltip}
        >
          <div
            className={`p-2 rounded-full ${
              selectedPage === "Friends" ? "bg-teal-200" : "bg-stone-200"
            } hover:scale-110`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 font-bold"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <circle
                  cx="12"
                  cy="8"
                  r="2.5"
                  stroke="#222222"
                  strokeLinecap="round"
                ></circle>
                <path
                  d="M13.7679 6.5C13.9657 6.15743 14.2607 5.88121 14.6154 5.70625C14.9702 5.5313 15.3689 5.46548 15.7611 5.51711C16.1532 5.56874 16.5213 5.73551 16.8187 5.99632C17.1161 6.25713 17.3295 6.60028 17.4319 6.98236C17.5342 7.36445 17.521 7.76831 17.3939 8.14288C17.2667 8.51745 17.0313 8.8459 16.7175 9.08671C16.4037 9.32751 16.0255 9.46985 15.6308 9.49572C15.2361 9.52159 14.8426 9.42983 14.5 9.23205"
                  stroke="#222222"
                ></path>
                <path
                  d="M10.2321 6.5C10.0343 6.15743 9.73935 5.88121 9.38458 5.70625C9.02981 5.5313 8.63113 5.46548 8.23895 5.51711C7.84677 5.56874 7.47871 5.73551 7.18131 5.99632C6.88391 6.25713 6.67053 6.60028 6.56815 6.98236C6.46577 7.36445 6.47899 7.76831 6.60614 8.14288C6.73329 8.51745 6.96866 8.8459 7.28248 9.08671C7.5963 9.32751 7.97448 9.46985 8.36919 9.49572C8.76391 9.52159 9.15743 9.42983 9.5 9.23205"
                  stroke="#222222"
                ></path>
                <path
                  d="M12 12.5C16.0802 12.5 17.1335 15.8022 17.4054 17.507C17.4924 18.0524 17.0523 18.5 16.5 18.5H7.5C6.94771 18.5 6.50763 18.0524 6.59461 17.507C6.86649 15.8022 7.91976 12.5 12 12.5Z"
                  stroke="#222222"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M19.2965 15.4162L18.8115 15.5377L19.2965 15.4162ZM13.0871 12.5859L12.7179 12.2488L12.0974 12.9283L13.0051 13.0791L13.0871 12.5859ZM17.1813 16.5L16.701 16.639L16.8055 17H17.1813V16.5ZM15.5 12C16.5277 12 17.2495 12.5027 17.7783 13.2069C18.3177 13.9253 18.6344 14.8306 18.8115 15.5377L19.7816 15.2948C19.5904 14.5315 19.2329 13.4787 18.578 12.6065C17.9126 11.7203 16.9202 11 15.5 11V12ZM13.4563 12.923C13.9567 12.375 14.6107 12 15.5 12V11C14.2828 11 13.3736 11.5306 12.7179 12.2488L13.4563 12.923ZM13.0051 13.0791C15.3056 13.4614 16.279 15.1801 16.701 16.639L17.6616 16.361C17.1905 14.7326 16.019 12.5663 13.1691 12.0927L13.0051 13.0791ZM18.395 16H17.1813V17H18.395V16ZM18.8115 15.5377C18.8653 15.7526 18.7075 16 18.395 16V17C19.2657 17 20.0152 16.2277 19.7816 15.2948L18.8115 15.5377Z"
                  fill="#222222"
                ></path>
                <path
                  d="M10.9129 12.5859L10.9949 13.0791L11.9026 12.9283L11.2821 12.2488L10.9129 12.5859ZM4.70343 15.4162L5.18845 15.5377L4.70343 15.4162ZM6.81868 16.5V17H7.19453L7.29898 16.639L6.81868 16.5ZM8.49999 12C9.38931 12 10.0433 12.375 10.5436 12.923L11.2821 12.2488C10.6264 11.5306 9.71723 11 8.49999 11V12ZM5.18845 15.5377C5.36554 14.8306 5.68228 13.9253 6.22167 13.2069C6.75048 12.5027 7.47226 12 8.49999 12V11C7.0798 11 6.08743 11.7203 5.42199 12.6065C4.76713 13.4787 4.40955 14.5315 4.21841 15.2948L5.18845 15.5377ZM5.60498 16C5.29247 16 5.13465 15.7526 5.18845 15.5377L4.21841 15.2948C3.98477 16.2277 4.73424 17 5.60498 17V16ZM6.81868 16H5.60498V17H6.81868V16ZM7.29898 16.639C7.72104 15.1801 8.69435 13.4614 10.9949 13.0791L10.8309 12.0927C7.98101 12.5663 6.8095 14.7326 6.33838 16.361L7.29898 16.639Z"
                  fill="#222222"
                ></path>
              </g>
            </svg>
          </div>
        </Link>
      </div>

      <div className="flex space-x-4 ml-auto mr-4">
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
              commentNotifications.length >
              0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {pendingRequests.length + likeNotifications.length}
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
          <div className="absolute right-0 top-14 w-72 bg-white shadow-lg rounded-xl border z-50">
            <div className="p-3 border-b font-semibold">Notifications</div>

            {pendingRequests.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">No notifications</p>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="p-3 border-b hover:bg-gray-50">
                  <p className="text-sm">
                    <span className="font-semibold">{request.sender.name}</span>{" "}
                    sent you a friend request
                  </p>
                </div>
              ))
            )}
            {likeNotifications.map((like) => (
              <div
                key={`like-${like.id}`}
                className="p-3 border-b hover:bg-gray-50"
              >
                <p className="text-sm">
                  <span className="font-semibold">
                    {like.user.name || like.user.username}
                  </span>{" "}
                  liked your post
                </p>
              </div>
            ))}
            {commentNotifications.map((comment) => (
              <div
                key={`comment-${comment.id}`}
                className="p-3 border-b hover:bg-gray-50"
              >
                <p className="text-sm">
                  <span className="font-semibold">
                    {comment.user.name || comment.user.username}
                  </span>{" "}
                  commented on your post
                </p>
              </div>
            ))}
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
          <div className="absolute right-16 top-14 w-72 bg-white shadow-lg rounded-xl border z-50">
            <div className="p-3 border-b font-semibold">Messages</div>

            {inboxUsers.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">No conversations yet</p>
            ) : (
              inboxUsers.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => {
                    setActiveChats((prev) => {
                      if (prev.some((chat) => chat.userId === user.userId)) {
                        return prev;
                      }

                      return [...prev, user];
                    });

                    setUnreadChats((prev) =>
                      prev.filter((id) => id !== user.userId),
                    );

                    fetch(
                      `http://localhost:8080/api/messages/read/${user.userId}`,
                      {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      },
                    );

                    setShowMessages(false);
                  }}
                  className={`p-3 border-b cursor-pointer ${
                    unreadChats.includes(user.userId)
                      ? "bg-cyan-100 hover:bg-cyan-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="font-semibold">{user.name}</p>

                  <p className="text-sm text-gray-500 truncate">
                    {user.latestSenderUsername ===
                    localStorage.getItem("username")
                      ? `You: ${user.latestMessage}`
                      : user.latestMessage}
                  </p>
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
              {" "}
              {/* Adjust position here */}
              <NavProfilePopUp handleLogout={handleLogout} />
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

      {activeChats.map((chat, index) => (
        <div
          key={chat.userId}
          className="fixed bottom-4 bg-white border shadow-xl rounded-xl z-50 w-80"
          style={{
            right: `${16 + index * 340}px`,
          }}
        >
          <div className="flex items-center justify-between p-3 border-b bg-teal-600">
            <h2 className="font-semibold text-white">{chat.name}</h2>

            <button
              onClick={() => {
                setMinimizedChats((prev) =>
                  prev.includes(chat.userId)
                    ? prev.filter((id) => id !== chat.userId)
                    : [...prev, chat.userId],
                );
              }}
              className="text-zinc-100"
            >
              _
            </button>

            <button
              onClick={() =>
                setActiveChats((prev) =>
                  prev.filter((c) => c.userId !== chat.userId),
                )
              }
              className="text-zinc-100 hover:text-red-300"
            >
              ✕
            </button>
          </div>

          {!minimizedChats.includes(chat.userId) && (
            <ChatWindow userId={chat.userId} userName={chat.name} />
          )}
        </div>
      ))}
    </nav>
  );
}
