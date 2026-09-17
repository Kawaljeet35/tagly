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

      setFriends(data);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/accept/${requestId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      fetchFriendRequests();
      fetchFriends();
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

      fetchFriendRequests();
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

  const unfriend = async (friendshipId) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/unfriend/${friendshipId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      fetchFriends();
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

      <main className="pt-[80px] pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
            <p className="text-gray-500 mt-1">
              Manage your friend requests and connections
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-3xl font-bold text-teal-600 mt-1">
                {requests.length}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Friends</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {friends.length}
              </p>
            </div>
          </div>

          {/* Friend Requests */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Friend Requests
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                People who want to connect with you
              </p>
            </div>

            <div className="p-6">
              {requests.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  You don't have any pending friend requests.
                </p>
              ) : (
                requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      src={request.sender.profilePictureUrl}
                      alt="profile"
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {request.sender.name}
                      </p>

                      <p className="text-sm text-gray-500">
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

          {/* Friends */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Friends</h2>
              <p className="text-sm text-gray-500 mt-1">
                People you're connected with
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  You don't have any friends yet.
                </p>
              ) : (
                friends.map((friend) => {
                  const friendUser =
                    friend.sender.id === currentUser?.id
                      ? friend.receiver
                      : friend.sender;

                  return (
                    <div
                      key={friend.id}
                      onClick={() => navigate(`/users/${friendUser.id}`)}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={friendUser.profilePictureUrl}
                          alt="profile"
                          className="w-20 h-20 rounded-full object-cover mb-3"
                        />

                        <p className="font-semibold text-gray-900">
                          {friendUser.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          @{friendUser.username}
                        </p>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/messages/${friendUser.id}`);
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
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
