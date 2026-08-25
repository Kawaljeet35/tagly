import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Users({ handleLogout, profilePictureUrl }) {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        profilePictureUrl={profilePictureUrl}
      />

      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {users.map((user) => (
        <Link to={`/users/${user.id}`} key={user.id}>
          <div className="flex items-center gap-3 bg-stone-100 p-3 rounded mb-3">
            <img
              src={user.profilePictureUrl}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold">{user.name}</p>

              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
