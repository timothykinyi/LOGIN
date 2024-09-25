import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DoorAccess = () => {
  const [doorCode, setDoorCode] = useState(''); // For the door code input
  const [doorStatus, setDoorStatus] = useState(null); // Door open status
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {

  }, []);

  // Function to send eID and doorCode to the door system
  const sendEIDToDoor = async () => {
    const eID = 111
    //sessionStorage.getItem('eID'); // Get eID from sessionStorage

    if (!eID) {
      alert('No eID found in session storage. Please log in.');
      return;
    }

    if (!doorCode) {
      alert('Please enter the door code.');
      return;
    }

    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      const response = await axios.post('https://login-9ebe.onrender.com/door/dID/check-eid', { eID, doorCode });

      if (response.data.code === 1) {
        setDoorStatus('Door Opened');
      } else {
        setDoorStatus('Access Denied');
      }
    } catch (error) {
      setError('Failed to communicate with the door system');
      console.error('Error sending eID to door:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div>
      <h1>Door Access System</h1>

      {/* Input for the door code */}
      <div>
        <input
          type="text"
          placeholder="Enter Door Code"
          value={doorCode}
          onChange={(e) => setDoorCode(e.target.value)}
        />
      </div>

      {/* Button to send the eID and door code */}
      <div>
        <button onClick={sendEIDToDoor} disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Open Door'}
        </button>
      </div>

      {/* Display door status */}
      <div>
        {isLoading ? (
          <p>Loading... Checking door status</p>
        ) : (
          <p>{doorStatus}</p>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default DoorAccess;
