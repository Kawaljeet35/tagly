import { useState } from "react";
import Login from "./Login";
import HomePage from "./HomePage";

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(true);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

  return (
    <div>
        {isLoggedIn ? <HomePage /> : <Login onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

