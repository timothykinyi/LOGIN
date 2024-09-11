// Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navigation.css'; // Ensure to import the CSS file for navigation styling

const Navigation = () => {
  return (
    <nav className="nav">
      <Link to="legal-info">Legal Information</Link>
      <Link to="hobbies-interests">Hobbies and Interests</Link>
      <Link to="favorite-activities">Favorite Activities</Link>
      {/* Add more links as necessary */}
    </nav>
  );
};

export default Navigation;
