import pic from "../assets/pic.png";
import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ProfileTop({
  name,
  coverPhotoUrl,
  profilePictureUrl,
  fetchUser,
  userId,
  isOwnProfile,
  friendshipStatus,
  fetchFriendshipStatus,
  activeTab,
  setActiveTab,
}) {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCoverPopupVisible, setCoverPopupVisible] = useState(false);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [coverMessage, setCoverMessage] = useState("");
  const [coverLoading, setCoverLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [minimizedChat, setMinimizedChat] = useState(false);

  const handleProfilePictureUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append("file", selectedFile);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        },
      );
      if (response.ok) {
        await fetchUser();
        setMessage("Profile picture uploaded");

        setTimeout(() => {
          setPopupVisible(false);
          setSelectedFile(null);
          setMessage("");
          setLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCoverPhotoUpload = async () => {
    if (!selectedCoverFile) {
      alert("Please select a file");
      return;
    }

    setCoverLoading(true);

    const formData = new FormData();
    formData.append("file", selectedCoverFile);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/cover-photo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        await fetchUser();
        setCoverMessage("Cover photo uploaded");

        setTimeout(() => {
          setCoverPopupVisible(false);
          setSelectedCoverFile(null);
          setCoverMessage("");
          setCoverLoading(false);
        }, 1500);
      } else {
        setCoverMessage("Failed to upload cover photo");
        setCoverLoading(false);
      }
    } catch (error) {
      console.error(error);
      setCoverMessage("Something went wrong");
      setCoverLoading(false);
    }
  };

  const sendFriendRequest = async () => {
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

      if (response.ok) {
        await fetchFriendshipStatus();
        alert("Friend request sent");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const acceptFriendRequest = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/requests`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const requests = await response.json();

      const request = requests.find((req) => req.sender.id === userId);

      if (!request) return;

      const acceptResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/accept/${request.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (acceptResponse.ok) {
        await fetchFriendshipStatus();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const unfriend = async () => {
    const confirmed = window.confirm(`Remove ${name} from friends?`);

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const friendships = await response.json();

      const friendship = friendships.find(
        (friendship) =>
          friendship.sender.id === userId || friendship.receiver.id === userId,
      );

      if (!friendship) {
        throw new Error("Friendship not found");
      }

      const unfriendResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/unfriend/${friendship.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!unfriendResponse.ok) {
        throw new Error("Failed to unfriend user");
      }

      await fetchFriendshipStatus();
    } catch (error) {
      console.error("Error unfriending user:", error);
    }
  };

  return (
    <>
      <div
        className="w-[80%] max-w-4xl bg-cover bg-center h-[400px] rounded-lg relative left-1/2 transform -translate-x-1/2"
        style={{
          backgroundImage: `url("${
            coverPhotoUrl || "https://wallpapercave.com/wp/wp3246092.jpg"
          }")`,
        }}
      >
        {isOwnProfile ? (
          <button onClick={() => setPopupVisible(true)}>
            <img
              src={profilePictureUrl || pic}
              alt="Profile Pic"
              className="h-44 w-44 absolute object-cover bg-red-800 rounded-full bottom-0 transform translate-y-1/2 translate-x-1/4 border-[4px] border-white overflow-hidden"
            />
          </button>
        ) : (
          <img
            src={profilePictureUrl || pic}
            alt="Profile Pic"
            className="h-44 w-44 absolute object-cover bg-red-800 rounded-full bottom-0 transform translate-y-1/2 translate-x-1/4 border-[4px] border-white overflow-hidden"
          />
        )}

        {isOwnProfile && (
          <button
            onClick={() => setCoverPopupVisible(true)}
            className="absolute right-8 bottom-4 flex gap-2 items-center bg-stone-100 hover:bg-stone-200 py-2 px-4 rounded-md"
          >
            <svg
              viewBox="0 -2 32 32"
              className="h-5 w-5"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <title>camera</title> <desc>Created with Sketch Beta.</desc>{" "}
                <defs> </defs>{" "}
                <g
                  id="Page-1"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                  sketch:type="MSPage"
                >
                  {" "}
                  <g
                    id="Icon-Set-Filled"
                    sketch:type="MSLayerGroup"
                    transform="translate(-258.000000, -467.000000)"
                    fill="#000000"
                  >
                    {" "}
                    <path
                      d="M286,471 L283,471 L282,469 C281.411,467.837 281.104,467 280,467 L268,467 C266.896,467 266.53,467.954 266,469 L265,471 L262,471 C259.791,471 258,472.791 258,475 L258,491 C258,493.209 259.791,495 262,495 L286,495 C288.209,495 290,493.209 290,491 L290,475 C290,472.791 288.209,471 286,471 Z M274,491 C269.582,491 266,487.418 266,483 C266,478.582 269.582,475 274,475 C278.418,475 282,478.582 282,483 C282,487.418 278.418,491 274,491 Z M274,477 C270.687,477 268,479.687 268,483 C268,486.313 270.687,489 274,489 C277.313,489 280,486.313 280,483 C280,479.687 277.313,477 274,477 L274,477 Z"
                      id="camera"
                      sketch:type="MSShapeGroup"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
            <span className="font-medium">Add Cover Photo</span>
          </button>
        )}

        <div className="flex items-center justify-between absolute -bottom-[72px] left-[225px] right-0">
          <span className="font-bold text-2xl text-gray-900 dark:text-gray-300">
            {name}
          </span>
          <div className="flex items-center justify-between gap-2">
            {!isOwnProfile && (
              <button
                onClick={() => {
                  setShowChat(true);
                  setMinimizedChat(false);
                }}
                className="rounded-md bg-cyan-600 py-2 px-3 flex items-center justify-between gap-1"
              >
                <span className="text-white">Message</span>
              </button>
            )}
            {!isOwnProfile && (
              <button
                onClick={
                  friendshipStatus === "RECEIVED"
                    ? acceptFriendRequest
                    : friendshipStatus === "ACCEPTED"
                      ? unfriend
                      : sendFriendRequest
                }
                className="rounded-md bg-teal-600 py-2 px-3 text-white"
              >
                {friendshipStatus === "PENDING"
                  ? "Request Sent"
                  : friendshipStatus === "RECEIVED"
                    ? "Accept Request"
                    : friendshipStatus === "ACCEPTED"
                      ? "Friends"
                      : "Add Friend"}
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="w-[80%] max-w-4xl border-t-1 border-gray-400 mx-auto mt-[108px]"></hr>
      <div className="w-[80%] max-w-4xl mx-auto flex justify-between items-center mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm px-2 py-2">
        <ul className="flex items-center justify-start gap-2 text-gray-900 dark:text-gray-300">
          <li
            className={`py-2 px-4 rounded-md ${
              activeTab === "posts"
                ? "bg-gray-200 font-semibold text-gray-900"
                : "hover:bg-gray-300 dark:hover:bg-slate-700"
            }`}
          >
            <button onClick={() => setActiveTab("posts")}>Posts</button>
          </li>

          <li
            className={`py-2 px-4 rounded-md ${
              activeTab === "about"
                ? "bg-gray-200 font-semibold text-gray-900"
                : "hover:bg-gray-300 dark:hover:bg-slate-700"
            }`}
          >
            <button onClick={() => setActiveTab("about")}>About</button>
          </li>

          <li
            className={`py-2 px-4 rounded-md ${
              activeTab === "friends"
                ? "bg-gray-200 font-semibold text-gray-900"
                : "hover:bg-gray-300 dark:hover:bg-slate-700"
            }`}
          >
            <button onClick={() => setActiveTab("friends")}>Friends</button>
          </li>

          <li
            className={`py-2 px-4 rounded-md ${
              activeTab === "photos"
                ? "bg-gray-200 font-semibold text-gray-900"
                : "hover:bg-gray-300 dark:hover:bg-slate-700"
            }`}
          >
            <button onClick={() => setActiveTab("photos")}>Photos</button>
          </li>

          <li
            className={`py-2 px-4 rounded-md ${
              activeTab === "videos"
                ? "bg-gray-200 font-semibold text-gray-900"
                : "hover:bg-gray-300 dark:hover:bg-slate-700"
            }`}
          >
            <button onClick={() => setActiveTab("videos")}>Videos</button>
          </li>

          <li className="hover:bg-gray-300 dark:hover:bg-slate-700 py-2 px-4 rounded-md">
            <a href="#">More</a>
          </li>
        </ul>
      </div>
      {showChat && !isOwnProfile && (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-white border shadow-xl rounded-xl">
          <div className="flex items-center justify-between p-3 border-b bg-teal-600 rounded-t-xl">
            <div className="flex items-center gap-2">
              <img
                src={profilePictureUrl || pic}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />

              <h2 className="font-semibold text-white">{name}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimizedChat((prev) => !prev)}
                className="text-zinc-100 text-l leading-none hover:text-cyan-200"
              >
                —
              </button>

              <button
                onClick={() => setShowChat(false)}
                className="text-zinc-100 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>

          {!minimizedChat && <ChatWindow userId={userId} userName={name} />}
        </div>
      )}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p>Upload Profile Picture</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="w-32 h-32 object-cover rounded-full mt-2"
              />
            )}
            {message && <p className="text-green-600 mt-2">{message}</p>}
            <button
              onClick={handleProfilePictureUpload}
              disabled={loading}
              className={`mt-2 px-4 py-2 rounded ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={() => !loading && setPopupVisible(false)}
              disabled={loading}
              className={`mt-2 px-4 py-2 rounded ${
                loading ? "bg-gray-300" : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isCoverPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p>Upload Cover Photo</p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedCoverFile(e.target.files[0])}
            />

            {selectedCoverFile && (
              <img
                src={URL.createObjectURL(selectedCoverFile)}
                alt="cover preview"
                className="w-80 h-40 object-cover rounded-lg mt-2"
              />
            )}

            {coverMessage && (
              <p className="text-green-600 mt-2">{coverMessage}</p>
            )}

            <button
              onClick={handleCoverPhotoUpload}
              disabled={coverLoading}
              className={`mt-2 px-4 py-2 rounded ${
                coverLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {coverLoading ? "Uploading..." : "Upload"}
            </button>

            <button
              onClick={() => !coverLoading && setCoverPopupVisible(false)}
              disabled={coverLoading}
              className={`mt-2 ml-2 px-4 py-2 rounded ${
                coverLoading ? "bg-gray-300" : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
