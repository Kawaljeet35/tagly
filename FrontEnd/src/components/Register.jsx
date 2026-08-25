import { useState } from "react";

export default function Register({ onClose, onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUnmatchMessage, setPasswordUnmatchMessage] = useState("");
  const [registrationErrorMessage, setRegistrationErrorMessage] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && password && e.target.value !== confirmPassword) {
      setPasswordUnmatchMessage("Passwords do not match");
    } else {
      setPasswordUnmatchMessage("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && confirmPassword && e.target.value !== password) {
      setPasswordUnmatchMessage("Passwords do not match");
    } else {
      setPasswordUnmatchMessage("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const fname = formData.get("fname");
    const lname = formData.get("lname");
    const name = `${fname} ${lname}`;
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const birth_day = formData.get("day");
    const birth_month = formData.get("month");
    const birth_year = formData.get("year");
    const date_of_birth = `${birth_year}-${birth_month.padStart(
      2,
      "0",
    )}-${birth_day.padStart(2, "0")}`;
    const gender = formData.get("gender");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            name: name,
            email,
            password,
            date_of_birth,
            gender,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onClose();
          alert("Registration successful, please Login to your new account");
        } else {
          setRegistrationErrorMessage(data.message || "Registration failed");
        }
      } else {
        const errorData = await response.json();
        setRegistrationErrorMessage(errorData.message || "Registration failed");
      }
    } catch (error) {
      setRegistrationErrorMessage("Error registering.", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white p-4 rounded shadow-lg w-[95%] max-w-[460px]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <button
            onClick={onClose}
            className="text-3xl font-bold text-gray-400"
          >
            &times;
          </button>
        </div>

        <p>It's quick and easy.</p>
        <hr className="mt-2" />

        <form onSubmit={handleRegister} className="mt-3 space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              name="fname"
              placeholder="First Name"
              className="input-default w-1/2 px-2 py-1 text-lg rounded"
              required
            />
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              className="input-default w-1/2 px-2 py-1 text-lg rounded"
              required
            />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            pattern="^[a-zA-Z0-9_]{3,15}$"
            title="3-15 characters, letters, numbers, underscore only"
            className="input-default w-full px-2 py-1 text-lg rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="input-default w-full px-2 py-1 text-lg rounded"
            required
          />

          {registrationErrorMessage &&
            registrationErrorMessage ===
              "Email already exists, try logging in." && (
              <p className="text-red-500">{registrationErrorMessage}</p>
            )}

          <input
            type="password"
            value={password}
            name="password"
            placeholder="New password"
            className="input-default w-full px-2 py-1 text-lg rounded"
            required
            onChange={handlePasswordChange}
            onBlur={handlePasswordChange}
          />
          <input
            type="password"
            value={confirmPassword}
            name="confirmpassword"
            placeholder="Confirm password"
            className="input-default w-full px-2 py-1 text-lg rounded"
            required
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordChange}
          />

          {passwordUnmatchMessage && (
            <p className="text-red-500">{passwordUnmatchMessage}</p>
          )}

          <div>
            <label className="font-normal">Date of Birth</label>
            <div className="flex space-x-2 mt-1">
              <select
                className="input-default w-1/3 px-2 py-1 text-lg rounded"
                name="day"
                required
              >
                <option value="" disabled selected>
                  Day
                </option>
                {/* Options for days */}
                {Array.from({ length: 31 }, (_, i) => (
                  <option
                    key={i + 1}
                    value={i + 1}
                    className="input-default w-1/2 p-2 text-lg rounded"
                  >
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                className="input-default w-1/3 px-2 py-1 text-lg rounded"
                name="month"
                required
              >
                <option value="" disabled selected>
                  Month
                </option>
                {/* Options for months */}
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, index) => (
                  <option
                    key={index + 1}
                    value={index + 1}
                    className="input-default w-1/2 p-2 text-lg rounded"
                  >
                    {month}
                  </option>
                ))}
              </select>

              <select
                className="input-default w-1/3 px-2 py-1 text-lg rounded"
                name="year"
                required
              >
                <option value="" disabled selected>
                  Year
                </option>
                {/* Options for years */}
                {Array.from(
                  { length: 100 },
                  (_, i) => new Date().getFullYear() - i,
                ).map((year) => (
                  <option
                    key={year}
                    value={year}
                    className="input-default w-1/2 px-2 py-1 text-lg rounded"
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-normal">Gender</label>
            <div className="flex space-x-2 w-full mt-1">
              <label className="flex items-center border rounded px-2 py-1 justify-between cursor-pointer text-lg w-1/3">
                Female
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  className="ml-2"
                  required
                />
              </label>
              <label className="flex items-center border rounded px-2 py-1 justify-between cursor-pointer text-lg w-1/3">
                Male
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  className="ml-2"
                  required
                />
              </label>
              <label className="flex items-center border rounded px-2 py-1 justify-between cursor-pointer text-lg w-1/3">
                Other
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  className="ml-2"
                  required
                />
              </label>
            </div>
          </div>

          <p className="text-sm mt-2 mb-2">
            By clicking Sign Up, you agree to our Terms, Privacy Policy and
            Cookies Policy.
          </p>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 text-xl font-bold rounded mb-1"
          >
            Sign Up
          </button>

          {registrationErrorMessage &&
            registrationErrorMessage !==
              "Email already exists, try logging in." && (
              <p className="text-red-500">{registrationErrorMessage}</p>
            )}
        </form>
      </div>
    </div>
  );
}
