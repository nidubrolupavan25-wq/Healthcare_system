import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import api from "../../services/api";
import "./login.css";

function Login({ closeModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    setError("");

    try {
      
      const loginRes = await api.post("/auth/login", {
        email,
        password,
      });


      if (loginRes.data?.status !== "success") {
        setError("Invalid email or password");
        return;
      }

     
      const userRes = await api.get(
        `/staff/email/${encodeURIComponent(email)}`
      );

     
      setUser(userRes.data);

     
      closeModal();

    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-inner">
      <h2>Welcome Back</h2>
      <p>Login to your account</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;
