import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [localUserData, setLocalUserData] = useState(null); // To handle locally stored data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Check if local file exists and load data from it
        const localData = await readFile();
        if (localData) {
          setLocalUserData(JSON.parse(localData)); // Load user details from the local file
        } else {
          // If no local file, fetch from the backend
          const token = sessionStorage.getItem('userToken');
          if (!token) {
            navigate('/');
            return;
          }

          const response = await fetch('https://login-9ebe.onrender.com/api/auth/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (response.ok) {
            setUser(data.user);

            // Save the user data to a file on the device
            await saveFile(JSON.stringify(data.user));
          } else {
            alert('Failed to fetch user details.');
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // File System Access API - Save Data to a File
  const saveFile = async (data) => {
    const options = {
      types: [
        {
          description: 'JSON Files',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    };

    try {
      // Open file picker for saving
      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();

      // Write content to the file
      await writable.write(data);
      await writable.close();

      console.log('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  // File System Access API - Read Data from a File
  const readFile = async () => {
    try {
      // Open file picker to select the local file
      const [handle] = await window.showOpenFilePicker();
      const file = await handle.getFile();

      // Read file content as text
      const content = await file.text();
      console.log('File content:', content);

      return content;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userToken');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      {localUserData ? (
        <div>
          <h3>Local File User Data:</h3>
          <p>Email: {localUserData.email}</p>
          <p>Category: {localUserData.category}</p>
          <p>Username: {localUserData.username}</p>
        </div>
      ) : user ? (
        <div>
          <h3>Backend User Data:</h3>
          <p>Email: {user.email}</p>
          <p>Category: {user.category}</p>
          <p>Username: {user.username}</p>
        </div>
      ) : (
        <p className="loading">Loading user details...</p>
      )}

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
