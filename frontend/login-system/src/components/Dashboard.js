import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
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
          setUser(data);
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

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
          >
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
