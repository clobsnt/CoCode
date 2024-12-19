import React, { useState } from 'react';
import { Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        const user = { username, email, password };

        try {
            // Send the registration data to the backend
            const response = await fetch("http://localhost:4000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const result = await response.json();
            if (result.success) {
                setMessage("Registration successful!");
            } else {
                setMessage("Registration failed: " + result.message);
            }
            
        } catch (err) {
            setMessage("An error occurred");
            console.error("Error:", err);
        }
    };

    return (
        <div className='container'>
            <h2>Register</h2>
            <form onSubmit={handleRegister} className="form">
                <div className="form-group">
                    <label>User's name:</label>
                    <input 
                        type="text"
                        id="username"
                        placeholder="Enter full name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input"
                    />
                </div>
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
                <button type="submit" className="button">Register</button>
            </form>

            <div>
                <p>
                    <Link to="/login">Back to Login page</Link>
                </p>
            </div>  
        </div>
    );
}

export default Register;
