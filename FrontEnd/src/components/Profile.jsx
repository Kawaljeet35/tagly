import Navbar from "./Navbar";
import ProfileTop from "./ProfileTop";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile({ handleLogout }) {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState("NONE");
  const { id } = useParams();

  const fetchUser = async () => {
    try {
      const response = await fetch(
        id
          ? `http://localhost:8080/api/users/${id}`
          : "http://localhost:8080/api/users/me",
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
      const response = await fetch("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
        `http://localhost:8080/api/friends/status/${id}`,
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

  useEffect(() => {
    fetchUser();
    fetchCurrentUser();
    fetchFriendshipStatus();
  }, [id]);
  console.log(user);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        profilePictureUrl={currentUser?.profilePictureUrl}
      />
      <ProfileTop
        name={user?.name}
        profilePictureUrl={user?.profilePictureUrl}
        fetchUser={fetchUser}
        userId={user?.id}
        isOwnProfile={currentUser?.id === user?.id}
        friendshipStatus={friendshipStatus}
        fetchFriendshipStatus={fetchFriendshipStatus}
      />
    </>
  );
}
