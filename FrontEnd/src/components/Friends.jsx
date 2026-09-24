import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Friends({ handleLogout, profilePictureUrl }) {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [myFriends, setMyFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendStatuses, setFriendStatuses] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

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
      const endpoint = id
        ? `${import.meta.env.VITE_API_URL}/api/friends/all/${id}`
        : `${import.meta.env.VITE_API_URL}/api/friends/all`;

      const response = await fetch(endpoint, {
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

  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
    fetchMyFriends();
    fetchCurrentUser();
  }, [id]);

  useEffect(() => {
    fetchFriendshipStatuses();
  }, [friends, currentUser, id]);

  const getFriendUser = (friend) => {
    const profileOwnerId = id ? Number(id) : currentUser?.id;

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

  const isOtherUserProfile = id && currentUser && Number(id) !== currentUser.id;

  const filteredFriends = friends
    .filter((friend) => {
      const friendUser = getFriendUser(friend);

      // Do not display the logged-in user in another user's friends list
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
          {!isOtherUserProfile && (
            <div className="grid grid-cols-1 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Pending Requests</p>

                <p className="text-3xl font-bold text-teal-600 mt-1">
                  {requests.length}
                </p>
              </div>
            </div>
          )}

          {!isOtherUserProfile && (
            <>
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
            </>
          )}

          {/* Friends */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Friends ({filteredFriends.length})
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                People you're connected with
              </p>

              {/* Search Friends */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search friends by name or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  You don't have any friends yet.
                </p>
              ) : filteredFriends.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No friends found matching your search.
                </p>
              ) : (
                filteredFriends.map((friend) => {
                  const friendUser = getFriendUser(friend);

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
                          {isOtherUserProfile ? (
                            isMyFriend(friendUser.id) ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/messages/${friendUser.id}`);
                                }}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm"
                              >
                                Message
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
        </div>
      </main>
    </>
  );
}
