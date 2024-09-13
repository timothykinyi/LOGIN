import React, { useState } from 'react';

const AuthenticateBiometrics = () => {
  const [status, setStatus] = useState('');
  const userId = 'current-user-id'; // Replace with your actual user ID

  const handleAuthenticate = async () => {
    try {
      // Fetch authentication options from server
      const optionsResponse = await fetch(`/api/webauthn/auth-options?userId=${userId}`);
      const options = await optionsResponse.json();

      // Convert options for the browser
      const publicKeyCredentialRequestOptions = {
        ...options,
        challenge: Uint8Array.from(options.challenge, c => c.charCodeAt(0)),
        allowCredentials: options.allowCredentials.map(cred => ({
          ...cred,
          id: Uint8Array.from(cred.id, c => c.charCodeAt(0)),
        })),
      };

      // Request user to authenticate via biometrics
      const credential = await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });

      // Send the credential response to the server
      const authResponse = await fetch('/api/webauthn/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: credential.id,
          rawId: Array.from(new Uint8Array(credential.rawId)),
          response: {
            authenticatorData: Array.from(new Uint8Array(credential.response.authenticatorData)),
            clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
            signature: Array.from(new Uint8Array(credential.response.signature)),
            userHandle: Array.from(new Uint8Array(credential.response.userHandle)),
          },
          type: credential.type,
        }),
      });

      const authData = await authResponse.json();
      if (authData.success) {
        setStatus('Biometric authentication successful!');
      } else {
        setStatus('Biometric authentication failed.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error during authentication.');
    }
  };

  return (
    <div>
      <h2>Authenticate with Biometrics</h2>
      <button onClick={handleAuthenticate}>Authenticate</button>
      <p>{status}</p>
    </div>
  );
};

export default AuthenticateBiometrics;
