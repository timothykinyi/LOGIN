// src/components/FingerprintAuth.js
import React, { useState } from 'react';

const FingerprintAuth = () => {
  const [message, setMessage] = useState('');

  const authenticateWithFingerprint = async () => {
    try {
      if (!window.PublicKeyCredential) {
        setMessage('WebAuthn is not supported on this device.');
        return;
      }

      // Request a challenge from the backend (for security, not storing anything)
      const challengeResponse = await fetch('https://login-9ebe.onrender.com/auth/getChallenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const { challenge } = await challengeResponse.json();

      // Request fingerprint authentication
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
          userVerification: 'preferred'
        }
      });

      if (assertion) {
        // Notify the backend that the fingerprint was successfully verified
        const verificationResponse = await fetch('https://login-9ebe.onrender.com/auth/verifyFingerprint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true })
        });

        const result = await verificationResponse.json();

        if (result.success) {
          setMessage('Fingerprint authentication successful!');
        } else {
          setMessage('Authentication failed.');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setMessage('An error occurred during authentication.');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', width: '300px', margin: 'auto', marginTop: '50px' }}>
      <h2>Authenticate with Fingerprint</h2>
      <p>{message}</p>
      <button onClick={authenticateWithFingerprint} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Use Fingerprint
      </button>
    </div>
  );
};

export default FingerprintAuth;
