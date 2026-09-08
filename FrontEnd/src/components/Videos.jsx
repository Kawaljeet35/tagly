import Navbar from "./Navbar";
import { useEffect, useState } from "react";

export default function Videos({ handleLogout }) {
  const [currentUser, setCurrentUser] = useState(null);

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

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <Navbar
      handleLogout={handleLogout}
      profilePictureUrl={currentUser?.profilePictureUrl}
    />
  );
}
