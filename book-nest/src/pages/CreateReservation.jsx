import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./CreateReservation.scss";

export default function CreateReservation() {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  useEffect(() => {
    if (storedUser) setCurrentUser(storedUser);
    if (preselectedBook) setSelectedBookId(preselectedBook.id.toString());
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const booksRes = await axios.get(
        "https://libraryapi-yyc7.onrender.com/api/Books"
      );
      setBooks(booksRes.data.filter((b) => b.isAvailable));
    } catch (err) {
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedBookId || !storedUser) {
      setError("Missing book or user.");
      return;
    }
    console.log("Token: ", token);
    console.log("Token:", currentUser?.token);
    try {
      await axios.post(
        "https://libraryapi-yyc7.onrender.com/api/Reservations",
        {
          bookId: parseInt(selectedBookId),
          userId: storedUser.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setSuccess("Reservation successfully created!");
      setSelectedBookId("");
    } catch (err) {
      setError("Failed to create reservation.");
    }
  };

  const location = useLocation();
  const preselectedBook = location.state?.selectedBook;

  if (loading) return <div className="loading-message">Loading...</div>;

  return (
    <div className="reservation-container">
      <h1>Create a New Reservation</h1>

      {currentUser && (
        <p className="info-message">Reserving as: {currentUser.user.name}</p>
      )}

      <form onSubmit={handleSubmit} className="reservation-form">
        <label>
          Select Book:
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
          >
            <option value="">-- Choose a book --</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Reserve</button>
      </form>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
