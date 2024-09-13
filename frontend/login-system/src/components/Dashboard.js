import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import { addData, getData, openDB } from '../indexedDB'; // Import the IndexedDB helper
import './styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // First check if user details are stored locally in IndexedDB
        const db = await openDB('UserDatabase', 'users');
        const storedUser = await getData(db, 'users', 'userData');

        if (storedUser) {
          setUser(storedUser.data); // Load user details from IndexedDB
        } else {
          // Fetch from server if not available in IndexedDB
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

            // Store user data in IndexedDB
            await addData(db, 'users', { id: 'userData', data: data.user });
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

  const handleLogout = () => {
    sessionStorage.removeItem('userToken');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>

          {/* Add navigation links to gdashboard and bdashboard */}
          <nav>
            <ul>
              <li><Link to="/gDashboard">Go to G Dashboard</Link></li>
              <li><Link to="/dDashboard">Go to D Dashboard</Link></li>
            </ul>
          </nav>

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p className="loading">Loading user details...</p>
      )}
    </div>
  );
};

export default Dashboard;
