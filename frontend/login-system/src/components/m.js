// src/WebAuthnRegister.js

import axios from 'axios';
import React, { useState } from 'react';

const WebAuthnRegister = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const startRegistration = async () => {
        if (!email) {
            setMessage('Please enter your email.');
            return;
        }

        try {
            // Step 1: Get registration options from backend
            const response = await axios.post('https://login-9ebe.onrender.com/api/auth/webauthn/register-options', { email });
            const options = response.data;

            // Step 2: Prepare the WebAuthn registration options
            const publicKey = {
                challenge: Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0)),
                rp: { name: options.rpName },
                user: {
                    id: Uint8Array.from(atob(options.userID), c => c.charCodeAt(0)),
                    name: options.userName,
                    displayName: options.userName
                },
                pubKeyCredParams: options.pubKeyCredParams,
                timeout: options.timeout,
                authenticatorSelection: options.authenticatorSelection,
                attestation: options.attestation
            };

            // Step 3: Start WebAuthn registration process
            const credential = await navigator.credentials.create({ publicKey });

            // Step 4: Send registration response back to the backend
            const verificationResponse = await axios.post('https://login-9ebe.onrender.com/api/auth/webauthn/register', {
                email,
                response: {
                    ...credential.response,
                    attestationObject: bufferToBase64(credential.response.attestationObject),
                    clientDataJSON: bufferToBase64(credential.response.clientDataJSON)
                }
            });

            const result = verificationResponse.data;
            setMessage(result.message);

        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('Registration failed. Please check the console for more details.');
        }
    };

    const bufferToBase64 = (buffer) => {
        const binary = String.fromCharCode(...new Uint8Array(buffer));
        return btoa(binary);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>WebAuthn Registration</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
            />
            <button
                onClick={startRegistration}
                style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
                Register Fingerprint
            </button>
            {message && <div style={{ marginTop: '10px', color: 'red' }}>{message}</div>}
        </div>
    );
};

export default WebAuthnRegister;
