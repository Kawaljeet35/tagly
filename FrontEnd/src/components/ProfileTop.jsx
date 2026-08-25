import pic from "../assets/pic.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileTop({
  name,
  coverPhotoUrl,
  profilePictureUrl,
  fetchUser,
  userId,
  isOwnProfile,
  friendshipStatus,
  fetchFriendshipStatus,
}) {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <div
        className="w-[80%] max-w-4xl bg-cover bg-center h-[400px] rounded-lg relative left-1/2 transform -translate-x-1/2"
        style={{
          backgroundImage: 'url("https://wallpapercave.com/wp/wp3246092.jpg")',
        }}
      >
        <button onClick={() => setPopupVisible(true)}>
          <img
            src={profilePictureUrl || pic}
            alt="Profile Pic"
            className="h-44 w-44 absolute object-cover bg-red-800 rounded-full bottom-0 transform translate-y-1/2 translate-x-1/4 border-[4px] border-white overflow-hidden"
          />
        </button>
        <button className="absolute right-8 bottom-4 flex gap-2 items-center bg-stone-100 hover:bg-stone-200 py-2 px-4 rounded-md">
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

        <div className="flex items-center justify-between gap-[108px] absolute -bottom-[72px] right-0">
          <span className="font-bold text-2xl">{name}</span>
          <div className="flex items-center justify-between gap-2">
            <button className="rounded-md bg-blue-600 py-2 px-3 flex items-center justify-between gap-1">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g id="Edit / Add_Plus">
                    {" "}
                    <path
                      id="Vector"
                      d="M6 12H12M12 12H18M12 12V18M12 12V6"
                      stroke="#ffffff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>{" "}
                </g>
              </svg>
              <span className="text-white">Add to story</span>
            </button>
            {isOwnProfile ? (
              <button className="rounded-md bg-gray-300 py-2 px-3 flex items-center justify-between gap-1">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z"
                      fill="#000000"
                    ></path>
                  </g>
                </svg>

                <span className="text-black">Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => navigate(`/messages/${userId}`)}
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
            <button className="rounded-md bg-gray-300 p-2">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z"
                    fill="#000000"
                  ></path>{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <hr className="w-[80%] max-w-4xl border-t-1 border-gray-400 mx-auto mt-[108px]"></hr>
      <div className="w-[80%] max-w-4xl mx-auto flex justify-between items-center mt-2">
        <ul className="flex items-center justify-around text-lg">
          <li className="hover:bg-gray-300 py-2 px-4 rounded-md">
            <a href="#">Posts</a>
          </li>
          <li className="hover:bg-gray-300 py-2 px-4 rounded-md">
            <a href="#">About</a>
          </li>
          <li className="hover:bg-gray-300 py-2 px-4 rounded-md">
            <a href="#">Friends</a>
          </li>
          <li className="hover:bg-gray-300 py-2 px-4 rounded-md">
            <a href="#">Photos</a>
          </li>
          <li className="hover:bg-gray-300 py-2 px-4 rounded-md">
            <a href="#">Videos</a>
          </li>
          <li className="hover:bg-gray-300 py-2 px-4 rounded-md">
            <a href="#">More</a>
          </li>
        </ul>
        <button className="rounded-md bg-gray-300 px-4 py-2">
          <svg
            className="w-6 h-6"
            fill="#000000"
            viewBox="0 0 32 32"
            enable-background="new 0 0 32 32"
            id="Glyph"
            version="1.1"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z"
                id="XMLID_287_"
              ></path>
              <path
                d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z"
                id="XMLID_289_"
              ></path>
              <path
                d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z"
                id="XMLID_291_"
              ></path>
            </g>
          </svg>
        </button>
      </div>
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
    </>
  );
}
