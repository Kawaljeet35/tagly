import { useState } from "react";
import logo from "../assets/mainLogoTagly.svg";
import Register from "./Register";

export default function Login({ onLoginSuccess }) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        onLoginSuccess();
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Error logging in");
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
          <a
            href=""
            className="w-max mx-auto text-center font-bold text-teal-700 text-lg hover:underline"
          >
            forgot password?
          </a>
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
      {isRegisterOpen && (
        <Register
          onClose={() => setIsRegisterOpen(false)}
          onLoginSuccess={onLoginSuccess}
        />
      )}
    </div>
  );
}
