import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";
import Videos from "./Videos";
import Friends from "./Friends";
import Users from "./Users";
import Messages from "./Messages";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home handleLogout={handleLogout} />} />
            <Route
              path="/users/:id"
              element={<Profile handleLogout={handleLogout} />}
            />
            <Route
              path="/profile"
              element={<Profile handleLogout={handleLogout} />}
            />
            <Route
              path="/videos"
              element={<Videos handleLogout={handleLogout} />}
            />
            <Route
              path="/friends"
              element={<Friends handleLogout={handleLogout} />}
            />
            <Route
              path="/messages/:id"
              element={<Messages handleLogout={handleLogout} />}
            />
            <Route path="*" element={<Home handleLogout={handleLogout} />} />
            <Route
              path="/users"
              element={<Users handleLogout={handleLogout} />}
            />
          </>
        ) : (
          <>
            <Route
              path="*"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
}
