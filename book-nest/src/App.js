import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.scss";

import HomePage from "./pages/HomePage";
import BookShelf from "./pages/BookShelf";
import CreateReservation from "./pages/CreateReservation";
import LoginModal from "./pages/LoginModal";

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const openLogin = (e) => {
    e.preventDefault();
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  useEffect(() => {
    const refreshToken = async () => {
      const saved = localStorage.getItem("user");
      if (!saved) return;

      const parsed = JSON.parse(saved);
      try {
        const res = await fetch("https://libraryapi-yyc7.onrender.com/api/User/refresh-token", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${parsed.token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const updatedUser = { ...parsed, token: data.token };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
        } else {
          console.warn("Token expired or invalid. Logging out.");
          handleLogout(); //auto-logout
        }
      } catch (err) {
        console.error("Error refreshing token. Logging out.");
        handleLogout(); // auto-logout
      }
    };

    refreshToken(); // on first login
    const interval = setInterval(refreshToken, 10 * 60 * 1000); // every 10 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <nav className="app-nav">
          <div className="app-nav-left">
            <Link to="/" className="nav-link nav-link--bold">HOME</Link>
            <Link to="/bookshelf" className="nav-link">Bookshelf</Link>
            <Link to="/reserve" className="nav-link">Create Reservation</Link>
          </div>
          <div className="app-nav-right">
            {currentUser ? (
              <>
                <span className="nav-link">Hello, {currentUser.user.name}</span>
                <span className="nav-link" onClick={handleLogout}>Logout</span>
              </>
            ) : (
              <Link to="#" className="nav-link nav-link--bold" onClick={openLogin}>
                Login
              </Link>
            )}
          </div>
        </nav>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bookshelf" element={<BookShelf />} />
            <Route path="/reserve" element={<CreateReservation />} />
          </Routes>
        </main>

        {isLoginOpen && <LoginModal onClose={closeLogin} onLogin={setCurrentUser} />}
      </div>
    </Router>
  );
}
