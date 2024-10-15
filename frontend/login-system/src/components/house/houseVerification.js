import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Verification.css';

function Verification() {
  const [HID, setHID] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState(null);
  const [HIDPresent, setHIDPresent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedHID = sessionStorage.getItem('HID');
    if (storedHID) {
      setHID(storedHID);
      setHIDPresent(true);
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const HIDToUse = HID;
      const response = await axios.post('https://login-9ebe.onrender.com/api/houses/verify', { HID: HIDToUse, verificationCode });
      if (response.status === 200) {
        navigate('/success');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Verification failed. Please try again.');
      }
    }
  };

  const handleresendCode = async () => {
    try {
      const HIDToUse = HID;
      if (!HIDToUse) {
        setError('House ID not found. Please ensure it is set.');
      } else {
        const response = await axios.post('https://login-9ebe.onrender.com/api/houses/resendemail', { HID: HIDToUse });
        if (response.status === 200) {
          setError('Verification code has been resent.');
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while resending the verification code. Try again later.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Verify Your House Registration</h2>
      <h4 style={{ color: 'white' }}>Check your email to get the verification code associated with your house registration.</h4>
      <form onSubmit={handleVerify}>
        {HIDPresent ? (
          <div>
            <label>House ID (HID):</label>
            <p>{HID}</p>
          </div>
        ) : (
          <div>
            <label>House ID (HID):</label>
            <input
              type="text"
              value={HID}
              onChange={(e) => setHID(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Verification Code:</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <button className="sign-in-btn" type="submit">Verify</button>
      </form>
      <button type="button" className="sign-in-btn" onClick={handleresendCode}>Resend verification code</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Verification;
