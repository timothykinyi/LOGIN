import axios from 'axios';
import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');

  const registerUser = async () => {
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
    axios.post('http://localhost:5000/register', {
      username,
      publicKey: JSON.stringify(credential),
    }).then((res) => {
      alert(res.data.message);
    }).catch(err => console.error(err));
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
    </div>
  );
};

export default Register;
