import { useState } from "react";
import logo from "../assets/mainLogoTagly.svg";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState(null);
  const [verificationError, setVerificationError] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);
        navigate("/", { replace: true });
        onLoginSuccess();
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Error logging in");
    }
  };

  const handleVerifyAccount = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const username = formData.get("verifyUsername");
    const email = formData.get("verifyEmail");
    const dateOfBirth = formData.get("verifyDateOfBirth");

    setVerificationError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            dateOfBirth,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setVerifiedAccount({
          username,
          email,
          dateOfBirth,
        });

        setIsAccountVerified(true);
      } else {
        setVerificationError(data.message || "Account details do not match");
      }
    } catch (error) {
      console.error("Error verifying account:", error);
      setVerificationError("Error verifying account");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    setResetPasswordError("");

    if (newPassword !== confirmPassword) {
      setResetPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: verifiedAccount.username,
            email: verifiedAccount.email,
            dateOfBirth: verifiedAccount.dateOfBirth,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setIsPasswordReset(true);
      } else {
        setResetPasswordError(data.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setResetPasswordError("Error resetting password");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16 min-h-screen px-2 transition-all duration-300">
      <div className="text-center lg:text-left">
        <img src={logo} alt="logo" className="h-16 mx-auto lg:mx-0" />
        <h1 className="text-3xl font-normal mt-4">
          Bringing people closer together,
          <br /> one post at a time.
        </h1>
      </div>

      <div className="w-full lg:w-4/12 flex justify-center">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-3 p-6 bg-white rounded-lg"
          style={{ width: "500px", boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}
        >
          <input
            required
            type="text"
            name="username"
            placeholder="Username"
            className="input-default p-3 text-xl rounded"
          />
          {errorMessage &&
            errorMessage === "No user exists with this email" && (
              <p className="text-red-500">{errorMessage}</p>
            )}
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            className="input-default p-3 text-xl rounded"
          />
          {errorMessage && errorMessage === "Incorrect password" && (
            <p className="text-red-500">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white p-3 text-xl font-bold rounded"
          >
            Log in
          </button>
          {errorMessage &&
            errorMessage !== "No user exists with this email" &&
            errorMessage !== "Incorrect password" && (
              <p className="text-red-500">{errorMessage}</p>
            )}
          <button
            type="button"
            onClick={() => setIsForgotPasswordOpen(true)}
            className="w-max mx-auto text-center font-bold text-teal-700 text-lg hover:underline"
          >
            forgot password?
          </button>
          <hr />
          <div className="flex justify-center my-4">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 w-max text-white p-2 text-lg font-bold rounded"
              onClick={() => setIsRegisterOpen(true)}
            >
              Create new account
            </button>
          </div>
        </form>
      </div>
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">Reset password</h2>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setIsAccountVerified(false);
                  setVerifiedAccount(null);
                  setVerificationError("");
                  setResetPasswordError("");
                  setIsPasswordReset(false);
                }}
                className="text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            {!isAccountVerified ? (
              <>
                <p className="text-gray-600 mb-5">
                  Enter your account details to verify your identity.
                </p>

                <form
                  onSubmit={handleVerifyAccount}
                  className="flex flex-col gap-3"
                >
                  <input
                    required
                    type="text"
                    name="verifyUsername"
                    placeholder="Username"
                    className="input-default p-3 text-lg rounded"
                  />

                  <input
                    required
                    type="email"
                    name="verifyEmail"
                    placeholder="Email"
                    className="input-default p-3 text-lg rounded"
                  />

                  <input
                    required
                    type="date"
                    name="verifyDateOfBirth"
                    className="input-default p-3 text-lg rounded"
                  />

                  {verificationError && (
                    <p className="text-red-500">{verificationError}</p>
                  )}

                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white p-3 text-lg font-bold rounded mt-2"
                  >
                    Verify account
                  </button>
                </form>
              </>
            ) : !isPasswordReset ? (
              <>
                <p className="text-green-600 text-lg font-semibold mb-5">
                  Account verified successfully.
                </p>

                <p className="text-gray-600 mb-5">
                  Enter your new password below.
                </p>

                <form
                  onSubmit={handleResetPassword}
                  className="flex flex-col gap-3"
                >
                  <input
                    required
                    type="password"
                    name="newPassword"
                    placeholder="New password"
                    className="input-default p-3 text-lg rounded"
                  />

                  <input
                    required
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    className="input-default p-3 text-lg rounded"
                  />

                  {resetPasswordError && (
                    <p className="text-red-500">{resetPasswordError}</p>
                  )}

                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white p-3 text-lg font-bold rounded mt-2"
                  >
                    Reset password
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <p className="text-green-600 text-lg font-semibold mb-4">
                  Password reset successfully!
                </p>

                <p className="text-gray-600 mb-5">
                  You can now log in with your new password.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    setIsAccountVerified(false);
                    setVerifiedAccount(null);
                    setVerificationError("");
                    setResetPasswordError("");
                    setIsPasswordReset(false);
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white p-3 text-lg font-bold rounded"
                >
                  Back to login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {isRegisterOpen && (
        <Register
          onClose={() => setIsRegisterOpen(false)}
          onLoginSuccess={onLoginSuccess}
        />
      )}
    </div>
  );
}
