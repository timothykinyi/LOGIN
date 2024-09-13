import React, { useState } from 'react';

const RegisterBiometrics = ({ userId }) => {
  const [status, setStatus] = useState('');

  const handleRegister = async () => {
    try {
      // Step 1: Get registration options from backend
      const optionsResponse = await fetch(`/api/webauthn/register-options?userId=${userId}`);
      const options = await optionsResponse.json();

      // Convert options for the browser
      const publicKeyCredentialCreationOptions = {
        ...options,
        challenge: Uint8Array.from(options.challenge, c => c.charCodeAt(0)),
        user: {
          ...options.user,
          id: Uint8Array.from(options.user.id, c => c.charCodeAt(0)),
        },
      };

      // Step 2: Register biometrics using WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      // Step 3: Send credential to the server for storage
      const registerResponse = await fetch('/api/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: credential.id,
          rawId: Array.from(new Uint8Array(credential.rawId)),
          response: {
            attestationObject: Array.from(new Uint8Array(credential.response.attestationObject)),
            clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
          },
          type: credential.type,
          userId,  // Include the userId to identify the user on the server
        }),
      });

      const registerData = await registerResponse.json();
      if (registerData.success) {
        setStatus('Biometrics registered successfully!');
      } else {
        setStatus('Registration failed.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error during registration.');
    }
  };

  return (
    <div>
      <h2>Register Biometrics</h2>
      <button onClick={handleRegister}>Register Biometrics</button>
      <p>{status}</p>
    </div>
  );
};

export default RegisterBiometrics;
