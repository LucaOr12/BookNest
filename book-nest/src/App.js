import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.scss";

import HomePage from "./pages/HomePage";
import BookShelf from "./pages/BookShelf";
import CreateReservation from "./pages/CreateReservation";
import LoginModal from "./pages/LoginModal";

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);

  const openLogin = (e) => {
    e.preventDefault();
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

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
            {user ? (
              <span className="nav-link nav-link--bold">Hello, {user.name}</span>
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

        {isLoginOpen && <LoginModal onClose={closeLogin} onLogin={setUser} />}
      </div>
    </Router>
  );
}
