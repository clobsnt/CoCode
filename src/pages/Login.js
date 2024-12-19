import React, {useState} from "react";
import "./Login.css";
// import Button from "../components/Button";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const credentials = { email, password };

        // Send login data to the backend
        const response = await fetch("http://localhost:4000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const result = await response.json();

        if (result.success) {
            // Store JWT token in localStorage upon successful login
            localStorage.setItem("token", result.token);
            window.location.href = "/";
        } else {
            setMessage("Login failed: " + result.message);
        }
    }

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="form">
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input 
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input"
                    />
                </div>
                { message && <p style={{ color: "red" }}>{message}</p> }
                <button type="submit" className="button">Login</button>
            </form>

            <div>
                <p>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}   

export default Login;