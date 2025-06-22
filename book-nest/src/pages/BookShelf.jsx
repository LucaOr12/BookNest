import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookShelf.scss";

export default function BookShelf() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/Books");
      const availableBooks = response.data.filter((book) => book.isAvailable);
      setBooks(availableBooks);
    } catch (error) {
      setError("Error fetching books.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="bookshelf-container">
      <h1>Available Books</h1>

      <input
        type="text"
        placeholder="Search by title or author..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredBooks.length === 0 ? (
        <p className="info-message">No books match your search.</p>
      ) : (
        <div className="bookshelf-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card-bookshelf">
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
      )}
    </div>
  );
}
