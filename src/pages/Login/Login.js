import React, { useState } from "react";
import "./Login.css";
import axios from "axios"; 
// import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:3000/login", {
            email, password,
        });
        alert(response.data.message);
    } catch (err) {
        setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
            placeholder="Enter password"
          />
        </div>
        { error && <p style={{ color: "red" }}>{error}</p> }
        <button type="submit" className="button">
            Login
        </button>
      </form>

      {/* <div className="register-link">
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div> */}
    </div>
  );
};

export default Login;
