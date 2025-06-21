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
        <nav className="app-nav-left">
          <Link to="/" className="nav-link nav-link--bold">HOME</Link>
          <Link to="/bookshelf" className="nav-link">Bookshelf</Link>
          <Link to="/reserve" className="nav-link">Create Reservation</Link>
          <nav className="app-nav-right">
            <Link to="" className="nav-link nav-link--bold">Login</Link>
          </nav>
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

