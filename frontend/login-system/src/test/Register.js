import axios from 'axios';
import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [error, setError] = useState(null);

  const onClick = async () => {
    try {
      // Step 1: Get registration options
      const optionsResponse = await axios.post('https://login-9ebe.onrender.com/auth/register-options', { username });
      const options = optionsResponse.data;

      // Assuming you already have some publicKey generation logic (like WebAuthn in-browser),
      // here's where you'd use that to generate the publicKey. This is a placeholder for the actual method.
      const generatedPublicKey = '<generate-public-key-based-on-options>';

      // Step 2: Send registration response to server
      const registerResponse = await axios.post('https://login-9ebe.onrender.com/auth/register', {
        username,
        publicKey: JSON.stringify(generatedPublicKey),
      });

      // Handle successful registration
      if (registerResponse.data.success) {
        alert('Registration successful!');
      } else {
        setError(registerResponse.data.message);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response ? err.response.data.message : 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />
      <button onClick={onClick}>Register</button>
    </div>
  );
};

export default Register;
