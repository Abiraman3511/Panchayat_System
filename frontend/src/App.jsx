import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("panchayatUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("panchayatUser", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("panchayatUser");
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <Home user={user} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
