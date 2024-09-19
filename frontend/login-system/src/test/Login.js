import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');

  const loginUser = async () => {
    const publicKeyCredential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32), // Server-provided challenge
      },
    });

    const credential = publicKeyCredential.toJSON();
    axios.post('http://localhost:5000/login', {
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
      <button onClick={loginUser}>Login with Fingerprint</button>
    </div>
  );
};

export default Login;
