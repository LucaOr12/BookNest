import React, { useState } from "react";
import axios from "axios";
import "./LoginModal.scss";

export default function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // stato di loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = isRegistering
        ? "https://libraryapi-yyc7.onrender.com/api/User"
        : "https://libraryapi-yyc7.onrender.com/api/User/login";

      const payload = isRegistering
        ? { email, name, password }
        : { email, password };

      const res = await axios.post(endpoint, payload);
      const data = res.data;

      onLogin?.(data);
      localStorage.setItem("user", JSON.stringify(data));

      // chiudi modal dopo login
      onClose();
    } catch (err) {
      console.error(err);
      if (isRegistering) {
        setError(
          "Registration failed. User may already exist or data is not valid."
        );
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>{isRegistering ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit} className={isLoading ? "loading" : ""}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {isRegistering && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          )}
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner" />
            ) : isRegistering ? (
              "Register"
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="toggle-mode">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
