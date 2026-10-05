import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";
import DiscoverPage from "./DiscoverPage";
import Users from "./Users";
import Messages from "./Messages";
import AccountSettings from "./AccountSettings";
import FAQ from "./FAQ";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hasSeenNotifications");
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
              path="/discover"
              element={<DiscoverPage handleLogout={handleLogout} />}
            />
            <Route
              path="/messages/:id"
              element={<Messages handleLogout={handleLogout} />}
            />
            <Route path="/faq" element={<FAQ handleLogout={handleLogout} />} />
            <Route
              path="/account-settings"
              element={<AccountSettings handleLogout={handleLogout} />}
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
