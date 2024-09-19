import axios from 'axios';
import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');  // State for success or error message
  const [isSuccess, setIsSuccess] = useState(null);  // State to track login success

  const loginUser = async () => {
    try {
      const publicKeyCredential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32), // Server-provided challenge
        },
      });

      const credential = publicKeyCredential.toJSON();
      
      const res = await axios.post('https://login-9ebe.onrender.com/auth/login', {
        username,
        publicKey: JSON.stringify(credential),
      });

      // Handle success response
      setIsSuccess(true);
      setMessage(res.data.message);
      
    } catch (err) {
      // Handle error response
      setIsSuccess(false);
      setMessage('Login failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={loginUser}>Login with Fingerprint</button>

      {/* Display login status message */}
      {message && (
        <div style={{ color: isSuccess ? 'green' : 'red', marginTop: '10px' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Login;
