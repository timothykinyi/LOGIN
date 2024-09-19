import axios from 'axios';
import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');  // State for success or error message
  const [isSuccess, setIsSuccess] = useState(null);  // State to track registration success

  const registerUser = async () => {
    try {
      // Generate a random challenge for WebAuthn
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Create the publicKey credential request for fingerprint
      const publicKeyCredential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: { name: "Fingerprint Login" },
          user: {
            id: new Uint8Array(16), // User ID as a Uint8Array
            name: username,
            displayName: username,
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Ensure it's a platform authenticator (fingerprint)
            userVerification: "required", // Ensure that user verification is required (biometric/fingerprint)
          },
          timeout: 60000, // Timeout of 60 seconds
          attestation: "direct", // Attestation to confirm the credential
        },
      });

      // Ensure the credential is not empty
      if (!publicKeyCredential) {
        throw new Error("Fingerprint authentication was not completed.");
      }

      // Send the credential to the backend for registration
      const credential = publicKeyCredential.toJSON();
      const res = await axios.post('https://login-9ebe.onrender.com/auth/register', {
        username,
        publicKey: JSON.stringify(credential),
      });

      // Handle success response
      setIsSuccess(true);
      setMessage(res.data.message);
      
    } catch (err) {
      // Handle backend error response or client-side WebAuthn error
      if (err.name === 'NotAllowedError') {
        setMessage('Fingerprint authentication canceled or not recognized.');
      } else if (err.response && err.response.data && err.response.data.message) {
        // Display backend error message
        setMessage(err.response.data.message);
      } else {
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
