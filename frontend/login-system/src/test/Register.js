import axios from 'axios';
import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');  // State for success or error message
  const [isSuccess, setIsSuccess] = useState(null);  // State to track registration success

  const registerUser = async () => {
    try {
      const publicKeyCredential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32), // Random challenge sent by the server
          rp: { name: "Fingerprint Login" },
          user: {
            id: new Uint8Array(16), // User ID as a Uint8Array
            name: username,
            displayName: username,
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        },
      });

      // Send the publicKey to the backend for registration
      const credential = publicKeyCredential.toJSON();
      const res = await axios.post('https://login-9ebe.onrender.com/auth/register', {
        username,
        publicKey: JSON.stringify(credential),
      });

      // Handle success response
      setIsSuccess(true);
      setMessage(res.data.message);
      
    } catch (err) {
      // Handle backend error response
      if (err.response && err.response.data && err.response.data.message) {
        // Set the error message returned from the backend
        setMessage(err.response.data.message);
      } else {
        // Fallback error message
        setMessage('An unexpected error occurred during registration. Please try again.');
      }
      setIsSuccess(false);
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
      <button onClick={registerUser}>Register with Fingerprint</button>

      {/* Display registration status message */}
      {message && (
        <div style={{ color: isSuccess ? 'green' : 'red', marginTop: '10px' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Register;
