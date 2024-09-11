import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
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
          setUser(data.user); // Ensure correct path if response wraps the user object
        } else {
          alert('Failed to fetch user details.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  useEffect(() => {
    if (user) {

    }
  }, [user]);

  const handleLogout = () => {
    sessionStorage.removeItem('userToken');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>Category: {user.category}</p>
          <p>Username: {user.username}</p>
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p className="loading">Loading user details...</p>
      )}
    </div>
  );
};

export default Dashboard;
