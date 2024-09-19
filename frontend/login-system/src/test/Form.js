import axios from 'axios';
import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');

  const registerUser = async () => {
    // Get registration options
    const { data } = await axios.post('https://login-9ebe.onrender.com/auth/register-options', { username });
    const publicKeyCredential = await navigator.credentials.create({ publicKey: data });

    const credential = publicKeyCredential.toJSON();
    axios.post('https://login-9ebe.onrender.com/auth/register', {
      username,
      publicKey: JSON.stringify(credential),
    }).then(res => alert(res.data.message))
      .catch(err => console.error(err));
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
