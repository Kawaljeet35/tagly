import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Friends({ handleLogout, profilePictureUrl }) {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const fetchFriendRequests = async () => {
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

      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/friends/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      setFriends(data);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await fetch(`http://localhost:8080/api/friends/accept/${requestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchFriendRequests();
      fetchFriends();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      console.log(data);
      setCurrentUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
    fetchCurrentUser();
  }, []);

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        profilePictureUrl={currentUser?.profilePictureUrl}
      />

      <div className="mt-20 p-4">
        <h1 className="text-2xl font-bold">Friends Page</h1>
        <p className="mt-4">Pending Requests: {requests.length}</p>

        <p className="mt-2">Total Friends: {friends.length}</p>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Friend Requests</h2>

          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center gap-3 mb-3 bg-stone-100 p-3 rounded"
            >
              <img
                src={request.sender.profilePictureUrl}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <p className="font-semibold">{request.sender.name}</p>

                <p className="text-sm text-gray-600">
                  @{request.sender.username}
                </p>
              </div>
              <button
                onClick={() => acceptRequest(request.id)}
                className="mt-2 bg-teal-600 text-white px-3 py-1 rounded"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Friends</h2>
          {friends.map((friend) => {
            const friendUser =
              friend.sender.id === currentUser?.id
                ? friend.receiver
                : friend.sender;

            return (
              <div
                key={friend.id}
                onClick={() => navigate(`/users/${friendUser.id}`)}
                className="inline-flex items-center gap-3 mb-3 bg-stone-100 p-3 rounded cursor-pointer hover:bg-stone-200"
              >
                <img
                  src={friendUser.profilePictureUrl}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold">{friendUser.name}</p>

                  <p className="text-sm text-gray-600">
                    @{friendUser.username}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
