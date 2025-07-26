import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookShelf.scss";

export default function BookShelf() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://libraryapi-yyc7.onrender.com/api/Books"
      );
      const availableBooks = response.data.filter((book) => book.isAvailable);
      setBooks(availableBooks);
    } catch (error) {
      console.warn("Error fetching books from API.");
      try {
        const fallbackResp = await fetch("/books-fallback.json");
        const fallbackData = await fallbackResp.json();
        setBooks(fallbackData.filter((book) => book.isAvailable));
      } catch (fallbackErr) {
        setError("Failed to load books from fallback");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();
  const handleReserve = (book) => {
    navigate("/reserve", { state: { selectedBook: book } });
  };

  const openModal = (book) => setSelectedBook(book);
  const closeModal = () => setSelectedBook(null);

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
            <div
              key={book.id}
              className="book-card-bookshelf"
              onClick={() => openModal(book)}
            >
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

      {selectedBook && (
        <div className="book-modal-backdrop" onClick={closeModal}>
          <div className="book-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
            <h2>{selectedBook.title}</h2>
            <p>
              <strong>Author:</strong> {selectedBook.author}
            </p>
            {selectedBook.coverUrl && (
              <img
                src={selectedBook.coverUrl}
                alt={`Cover of ${selectedBook.title}`}
                className="book-cover"
              />
            )}
            <button
              className="reserve-button"
              onClick={() => handleReserve(selectedBook)}
            >
              Reserve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
