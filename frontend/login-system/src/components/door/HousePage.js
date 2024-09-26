import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AccessControl from './AccessControl';
import DoorManagement from './DoorManagement';

const HousePage = () => {
  const { houseId } = useParams();
  const [house, setHouse] = useState(null);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await axios.get(`https://login-9ebe.onrender.com//api/houses/${houseId}`);
        setHouse(response.data);
      } catch (error) {
        console.error("Error fetching house details:", error);
      }
    };
    fetchHouse();
  }, [houseId]);

  return (
    <div>
      <h1>{house?.name || 'House Dashboard'}</h1>
      <DoorManagement houseId={houseId} />
      <AccessControl houseId={houseId} />
    </div>
  );
};

export default HousePage;
