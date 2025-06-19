import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.scss";

import HomePage from "./pages/HomePage";
import BookShelf from "./pages/BookShelf";
import CreateReservation from "./pages/CreateReservation";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="app-nav">
          <Link to="/" className="nav-link nav-link--bold">Home</Link>
          <Link to="/bookshelf" className="nav-link">Bookshelf</Link>
          <Link to="/reserve" className="nav-link">Create Reservation</Link>
        </nav>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bookshelf" element={<BookShelf />} />
            <Route path="/reserve" element={<CreateReservation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

