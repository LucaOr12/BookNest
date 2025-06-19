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
      const allBooks = response.data;
      const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
      const randomBooks = shuffled.slice(0, 6);
      setBooks(randomBooks);
    } catch (error) {
      console.error("Errore nel recupero dei libri:", error);
      setError("Impossibile caricare i libri.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Caricamento in corso...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-container">
      <h1>Welcome to Book Nest!</h1>
      <p>Find some books from our catalogue</p>

      {books.length === 0 ? (
        <div className="placeholder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="100"
            viewBox="0 0 24 24"
            width="100"
            fill="#bbb"
          >
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16l7-3 7 3V4c0-1.1-.9-2-2-2zM6 18V6h12v12l-6-2.58L6 18z" />
          </svg>
          <p>No books available right now.</p>
        </div>
      ) : (
        <div className="books-list">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <h2>{book.title}</h2>
              <p><strong>Autore:</strong> {book.author}</p>
              <p>{book.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}