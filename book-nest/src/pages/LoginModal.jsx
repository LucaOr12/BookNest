import React, { useState } from "react";
import axios from "axios";
import "./LoginModal.scss";

export default function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = isRegistering
        ? "http://localhost:8080/api/User"
        : "http://localhost:8080/api/User/login";

      const res = await axios.post(endpoint, { email, name });
      const data = res.data;

      onLogin?.(data);
      onClose();
    } catch (err) {
      console.error(err);
      if (isRegistering) {
        setError("Registrazione fallita. Forse l'utente esiste già.");
      } else {
        setError("Email o nome non validi.");
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>{isRegistering ? "Registrazione" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">
            {isRegistering ? "Registrati" : "Login"}
          </button>
        </form>
        <p className="toggle-mode">
          {isRegistering ? "Hai già un account?" : "Non hai un account?"}{" "}
          <span onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Accedi" : "Registrati"}
          </span>
        </p>
      </div>
    </div>
  );
}
