import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/DataShare.css'; // Adjust the path as needed

const DataShareComponent = () => {
  const [userData, setUserData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [shareableLink, setShareableLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');

    if (!eID || !token) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://login-9ebe.onrender.com/api/user/${eID}`);
        setUserData(response.data); // Assuming response.data contains all user data
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, eID]);

  const handleSelectData = (category, item) => {
    setSelectedData(prev => ({
      ...prev,
      [category]: item
    }));
  };

  const handleSubmit = async () => {
    if (!Object.keys(selectedData).length) {
      alert('Please select at least one item to share.');
      return;
    }

    if (!deadlineDate) {
      alert('Please select a deadline date for sharing the data.');
      return;
    }

    const confirmSubmit = window.confirm('Are you sure you want to share the selected data?');
    if (!confirmSubmit) return;

    try {
      const response = await axios.post('https://login-9ebe.onrender.com/api/shared/share', { selectedData, eID, deadlineDate });
      setShareableLink(`https://own-my-data.web.app/sharedlink/${response.data.id}`);
    } catch (error) {
      console.error('Error sharing data:', error);
      setError('Failed to share data. Please try again later.');
    }
  };

  const handleClearSelection = () => {
    setSelectedData({});
    setDeadlineDate('');
  };

  return (
    <div className="data-share-container">
      <h2 className="section-title">Select Data to Share</h2>

      {loading && <p className="loading-message">Loading data...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && (
        <>
          <div className="data-section">
            <h3>Contact Information</h3>
            {userData.contacts && userData.contacts.map(contact => (
              <label key={contact._id}>
                <input
                  type="radio"
                  name="contacts"
                  value={contact._id}
                  checked={selectedData.contacts === contact._id}
                  onChange={() => handleSelectData('contacts', contact._id)}
                />
                {contact.phoneNumbers.map(num => num.number).join(', ')}
              </label>
            ))}
          </div>

          <div className="data-section">
            <h3>Education Data</h3>
            {userData.education && userData.education.map(education => (
              <label key={education._id}>
                <input
                  type="radio"
                  name="education"
                  value={education._id}
                  checked={selectedData.education === education._id}
                  onChange={() => handleSelectData('education', education._id)}
                />
                {education.institutionName} ({education.degree})
              </label>
            ))}
          </div>

          {/* Repeat similar structure for Employment, Financial, Health, etc. */}

          {/* Date Picker for Deadline */}
          <div className="deadline-picker">
            <label>
              Deadline Date:
              <input
                type="date"
                value={deadlineDate}
                onChange={e => setDeadlineDate(e.target.value)}
              />
            </label>
          </div>

          <div className="button-group">
            <button className="clear-btn" onClick={handleClearSelection}>
              Clear All Selections
            </button>
            <button className="submit-btn" onClick={handleSubmit}>
              Share Selected Data
            </button>
          </div>
          {shareableLink && (
            <p className="shareable-link">
              Shareable Link: <a href={shareableLink}>{shareableLink}</a>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default DataShareComponent;
