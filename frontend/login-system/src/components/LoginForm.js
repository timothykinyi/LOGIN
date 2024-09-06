// LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://login-9ebe.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input
          type={passwordVisible ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <div className="toggle-password">
          <input
            type="checkbox"
            checked={passwordVisible}
            onChange={() => setPasswordVisible(!passwordVisible)}
          />
          <label>Show Password</label>
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <a className="toggle-link" href="/register">Don't have an account? Register</a>
    </div>
  );
};

export default LoginForm;
