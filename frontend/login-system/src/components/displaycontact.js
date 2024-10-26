import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/displaycontact.css';

const ContactInfoList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');

    if (!eID || !token) {
      navigate('/');
      return;
    }

    // Fetch the contact data from the backend when the component mounts
    const fetchContactData = async () => {
      try {
        // Use the eID as a query parameter to the new endpoint
        const response = await axios.get(`https://login-9ebe.onrender.com/api/contact/all?eID=${eID}`);
        setContacts(response.data.data); // Assuming response.data.data contains the contacts array
        setLoading(false);
      } catch (error) {
        setError('Error fetching contact information');
        setLoading(false);
      }
    };

    fetchContactData();
  }, [eID, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="contact-container">
      <h2>Contact Information</h2>
      {contacts.length === 0 ? (
        <p className="contact-message">No contact information available</p>
      ) : (
        <ul className="contact-list">
          {contacts.map((contact, index) => (
            <li className="contact-item" key={index}>
              <p><strong>Phone Numbers:</strong> {contact.phoneNumbers.map(num => num.number).join(', ')}</p>
              <p><strong>Emails:</strong> {contact.emails.map(email => email.email).join(', ')}</p>
              <p><strong>Emergency Contacts:</strong></p>
              <ul className="contact-sublist">
                {contact.emergencyContacts.map((emergency, idx) => (
                  <li key={idx}>
                    <p>Name: {emergency.name}</p>
                    <p>Phone: {emergency.phone}</p>
                    <p>Address: {emergency.address}</p>
                  </li>
                ))}
              </ul>
              <p><strong>Social Media:</strong></p>
              <ul className="contact-sublist">
                {contact.socialMedia.map((social, idx) => (
                  <li key={idx}>
                    <p>Platform: {social.platform}</p>
                    <p>Username: {social.username}</p>
                  </li>
                ))}
              </ul>
              {contact.address ? (
                <p>
                  <strong>Address:</strong> {contact.address.streetAddress}, {contact.address.city}, {contact.address.state}, {contact.address.postalCode}, {contact.address.country}
                </p>
              ) : (
                <p><strong>Address:</strong> Not provided</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactInfoList;
