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
      const response = await axios.get("http://localhost:8080/api/Books");
      setBooks(response.data);
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
        {/* Duplico la lista per scorrimento infinito */}
        {[books, books].map((bookList, idx) => (
          <div key={idx}>
            {bookList.map((book) => (
              <div key={book.id} className="book-card">
                <h2>{book.title}</h2>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                <p>{book.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
