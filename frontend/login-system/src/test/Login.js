import axios from 'axios';
import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [error, setError] = useState(null);

  const onClick = async () => {
    try {
      // Step 1: Get login options
      const optionsResponse = await axios.post('https://login-9ebe.onrender.com/auth/login-options', { username });
      const options = optionsResponse.data;

      // Assuming you already have some publicKey generation logic for login
      const generatedPublicKey = '<generate-public-key-based-on-options>';

      // Step 2: Send login response to server
      const loginResponse = await axios.post('https://login-9ebe.onrender.com/auth/login', {
        username,
        publicKey: JSON.stringify(generatedPublicKey),
      });

      // Handle successful login
      if (loginResponse.data.success) {
        alert('Login successful!');
      } else {
        setError(loginResponse.data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response ? err.response.data.message : 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />
      <button onClick={onClick}>Login</button>
    </div>
  );
};

export default Login;
