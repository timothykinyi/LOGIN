import React from 'react';

const HouseList = ({ houses, onHouseClick }) => {
  return (
    <div>
      {houses.map((house) => (
        <div key={house._id} onClick={() => onHouseClick(house._id)}>
          <h3>{house.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default HouseList;
