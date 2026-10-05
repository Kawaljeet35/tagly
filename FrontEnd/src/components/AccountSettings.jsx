import Navbar from "./Navbar";
import { useEffect, useState } from "react";

export default function AccountSettings({ handleLogout }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
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
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage("New passwords do not match");
      return;
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMessage("Please fill in all fields");
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const message = await response.text();

      if (response.ok) {
        setPasswordMessage("Password changed successfully");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");

        setTimeout(() => {
          setShowChangePassword(false);
          setPasswordMessage("");
        }, 1500);
      } else {
        setPasswordMessage(message || "Failed to change password");
      }
    } catch (error) {
      console.error(error);
      setPasswordMessage("Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  const settings = [
    {
      title: "Change Password",
      description: "Update your current password",
    },
    {
      title: "Deactivate Account",
      description: "Temporarily disable your Tagly account",
    },
    {
      title: "Delete Account",
      description: "Permanently delete your Tagly account",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-slate-800">
      <Navbar
        handleLogout={handleLogout}
        profilePictureUrl={currentUser?.profilePictureUrl}
      />

      <div className="min-h-screen pt-[68px] pb-5 px-4 flex flex-col">
        <div className="max-w-3xl w-full mx-auto my-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">
              Account Settings
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Manage your Tagly account.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">
                Account
              </h2>

              <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                {settings.map((setting, index) => (
                  <div
                    key={setting.title}
                    className={`p-4 flex items-center justify-between gap-6 ${
                      index !== settings.length - 1
                        ? "border-b border-gray-200 dark:border-slate-700"
                        : ""
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-200">
                        {setting.title}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {setting.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (setting.title === "Change Password") {
                          setPasswordMessage("");
                          setShowChangePassword(true);
                        }
                      }}
                      className="shrink-0 px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
                    >
                      {setting.title === "Change Password"
                        ? "Change"
                        : setting.title === "Deactivate Account"
                          ? "Deactivate"
                          : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showChangePassword && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onClick={() => {
            if (!passwordLoading) {
              setShowChangePassword(false);
              setPasswordMessage("");
            }
          }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                Change Password
              </h2>

              <button
                type="button"
                disabled={passwordLoading}
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordMessage("");
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Confirm new password"
                />
              </div>

              {passwordMessage && (
                <p
                  className={`text-sm ${
                    passwordMessage === "Password changed successfully"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {passwordMessage}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={passwordLoading}
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordMessage("");
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-60"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
