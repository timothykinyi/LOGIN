import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  // On component mount, retrieve the data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData)); // Parse and set the stored data
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Your Dashboard</h1>
      {userData ? (
        <div style={{ marginTop: '20px' }}>
          <h2>User Information</h2>
          <p><strong>Full Name:</strong> {userData.fullName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
          <p><strong>Category:</strong> {userData.category}</p>
          <p><strong>Date of Birth:</strong> {new Date(userData.dateOfBirth).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
