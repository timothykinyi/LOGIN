import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import HouseList from './HouseList';

const HomePage = () => {
  const [houses, setHouses] = useState([]);
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const userEID = "4321"; // Example ownerEID
        const response = await axios.get(`https://login-9ebe.onrender.com//api/houses?ownerEID=${userEID}`);
        setHouses(response.data);
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    };
    fetchHouses();
  }, []);

  const handleHouseClick = (houseId) => {
    navigate(`/house/${houseId}`); // Replace history.push with navigate
  };

  return (
    <div>
      <h1>Your Houses</h1>
      <HouseList houses={houses} onHouseClick={handleHouseClick} />
    </div>
  );
};

export default HomePage;
