import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.scss";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://libraryapi-yyc7.onrender.com/api/Books"
      );
      const availableBooks = response.data
        .filter((book) => book.isAvailable)
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
      setBooks(availableBooks);
    } catch (error) {
      setError("Error fetching books.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  if (books.length === 0)
    return (
      <div className="placeholder">
        <p>No books available right now.</p>
      </div>
    );

  return (
    <div className="home-container">
      <h1>Welcome to Book Nest!</h1>
      <p>Find some books from our catalogue</p>

      <div className="scroll" style={{ "--time": "60s" }}>
        {[books, books].map((bookList, idx) => (
          <div key={idx}>
            {bookList.map((book) => (
              <div key={book.id} className="book-card">
                <h2>{book.title}</h2>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                {book.coverUrl && (
                  <img
                    src={book.coverUrl}
                    alt={`Cover of ${book.title}`}
                    className="book-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
