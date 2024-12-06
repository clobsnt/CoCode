import React, { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('User registered successfully!');
      } else {
        setMessage(result.error || 'Registration failed');
      }
    } catch (error) {
      setMessage('An error occurred');
      console.error('Error:', error);
    }
  };

  return (
    <div className='container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-group'>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input'
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input'
          />
        </div>
        <button type="submit" className='button'>
          Register
        </button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}

export default Register;
