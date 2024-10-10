import axios from 'axios'; // Import axios for API requests
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ContactForm.css';

const ContactForm = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([{ id: Date.now(), number: '' }]);
  const [emails, setEmails] = useState([{ id: Date.now(), email: '' }]);
  const [emergencyContacts, setEmergencyContacts] = useState([{ id: Date.now(), name: '', phone: '', address: '' }]);
  const [socialMedia, setSocialMedia] = useState([{ id: Date.now(), platform: '', username: '' }]);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');
  useEffect(() => {
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
  if (!eID || !token)
    {
      navigate('/');
      return;
    }
  },[navigate]);
  const handlePhoneChange = (id, e) => {
    const { value } = e.target;
    setPhoneNumbers(prevNumbers =>
      prevNumbers.map(number =>
        number.id === id ? { ...number, number: value } : number
      )
    );
  };

  const handleEmailChange = (id, e) => {
    const { value } = e.target;
    setEmails(prevEmails =>
      prevEmails.map(email =>
        email.id === id ? { ...email, email: value } : email
      )
    );
  };

  const handleEmergencyContactChange = (id, e) => {
    const { name, value } = e.target;
    setEmergencyContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === id ? { ...contact, [name]: value } : contact
      )
    );
  };

  const handleSocialMediaChange = (id, e) => {
    const { name, value } = e.target;
    setSocialMedia(prevSocialMedia =>
      prevSocialMedia.map(social =>
        social.id === id ? { ...social, [name]: value } : social
      )
    );
  };

  const handleAddPhone = () => {
    setPhoneNumbers([...phoneNumbers, { id: Date.now(), number: '' }]);
  };

  const handleAddEmail = () => {
    setEmails([...emails, { id: Date.now(), email: '' }]);
  };

  const handleAddEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { id: Date.now(), name: '', phone: '', address: '' }]);
  };

  const handleAddSocialMedia = () => {
    setSocialMedia([...socialMedia, { id: Date.now(), platform: '', username: '' }]);
  };

  const handleRemovePhone = (id) => {
    setPhoneNumbers(phoneNumbers.filter(number => number.id !== id));
  };

  const handleRemoveEmail = (id) => {
    setEmails(emails.filter(email => email.id !== id));
  };

  const handleRemoveEmergencyContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };

  const handleRemoveSocialMedia = (id) => {
    setSocialMedia(socialMedia.filter(social => social.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      eID,
      phoneNumbers,
      emails,
      emergencyContacts,
      socialMedia,
    };

    try {
      const response = await axios.post('https://login-9ebe.onrender.com/api/contact', contactData);
      
      if (response.status === 200) {
        setSuccessMessage('Data successfully sent to the backend');
        setApiError('');
        console.log('Data successfully sent to the backend');
      } else {
        setApiError('An error occurred while submitting the form');
        setSuccessMessage('');
        console.error('Error sending data');
      }
    } catch (error) {
      setApiError('An error occurred while submitting the form');
      setSuccessMessage('');
      console.error('Error occurred:', error);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Contact Information</h2>

      <div className="section">
        <h3>Phone Numbers</h3>
        {phoneNumbers.map((entry) => (
          <div key={entry.id} className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={entry.number}
              onChange={(e) => handlePhoneChange(entry.id, e)}
              required
            />
            <div className="button-group">
              <button type="button" onClick={() => handleRemovePhone(entry.id)} className="sign-in-btn">
                Remove This Phone
              </button>
            </div>

          </div>
        ))}
        <div className="button-group">
          <button type="button" onClick={handleAddPhone} className="sign-in-btn">
            Add Another Phone Number
          </button>
        </div>

      </div>

      <div className="section">
        <h3>Email Addresses</h3>
        {emails.map((entry) => (
          <div key={entry.id} className="form-group">
            <label>Email Address:</label>
            <input
              type="email"
              name="email"
              value={entry.email}
              onChange={(e) => handleEmailChange(entry.id, e)}
              required
            />
            <div className="button-group">
              <button type="button" onClick={() => handleRemoveEmail(entry.id)} className="sign-in-btn">
                Remove This Email
              </button>
            </div>

          </div>
        ))}
        <div className="button-group">
          <button type="button" onClick={handleAddEmail} className="sign-in-btn">
            Add Another Email Address
          </button>
        </div>

      </div>

      <div className="section">
        <h3>Home Address</h3>
        <div className="form-group">
          <label>Street Address:</label>
          <input
            type="text"
            name="streetAddress"
            required
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            required
          />
        </div>
        <div className="form-group">
          <label>State/Province:</label>
          <input
            type="text"
            name="state"
            required
          />
        </div>
        <div className="form-group">
          <label>Postal Code:</label>
          <input
            type="text"
            name="postalCode"
            required
          />
        </div>
        <div className="form-group">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            required
          />
        </div>
      </div>

      <div className="section">
        <h3>Emergency Contacts</h3>
        {emergencyContacts.map((entry) => (
          <div key={entry.id} className="form-group">
            <label>Contact Name:</label>
            <input
              type="text"
              name="name"
              value={entry.name}
              onChange={(e) => handleEmergencyContactChange(entry.id, e)}
              required
            />
            <label>Phone Number:</label>
            <input
              type="text"
              name="phone"
              value={entry.phone}
              onChange={(e) => handleEmergencyContactChange(entry.id, e)}
              required
            />
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={entry.address}
              onChange={(e) => handleEmergencyContactChange(entry.id, e)}
            />
            <div className="button-group">
              <button type="button" onClick={() => handleRemoveEmergencyContact(entry.id)} className="sign-in-btn">
                Remove This Emergency Contact
              </button>
            </div>

          </div>
        ))}
        <div className="button-group">
          <button type="button" onClick={handleAddEmergencyContact} className="sign-in-btn">
            Add Another Emergency Contact
          </button>
        </div>

      </div>

      <div className="section">
        <h3>Social Media Accounts</h3>
        {socialMedia.map((entry) => (
          <div key={entry.id} className="form-group">
            <label>Platform:</label>
            <select
              name="platform"
              value={entry.platform}
              onChange={(e) => handleSocialMediaChange(entry.id, e)}
              required
            >
              <option value="">Select Social Media Platform</option>
              <option value="Facebook">Facebook</option>
              <option value="Twitter">Twitter</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Other">Other</option>
            </select>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={entry.username}
              onChange={(e) => handleSocialMediaChange(entry.id, e)}
            />
            <div className="button-group">
              <button type="button" onClick={() => handleRemoveSocialMedia(entry.id)} className="sign-in-btn">
                Remove This Social Media
              </button>
            </div>

          </div>
        ))}
        <div className="button-group">
          <button type="button" onClick={handleAddSocialMedia} className="sign-in-btn">
            Add Another Social Media Account
          </button>
        </div>

      </div>
      <div className="button-group">
      <button type="submit"className="sign-in-btn">Submit</button>
      </div>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {apiError && <p className="error-message">{apiError}</p>}
    </form>
  );
};

export default ContactForm;
