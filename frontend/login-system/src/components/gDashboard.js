// src/components/DataShare.js
import axios from 'axios';
import React, { useState } from 'react';

const DataShare = () => {
  const [selectedData, setSelectedData] = useState([]);
  const [shareDuration, setShareDuration] = useState('1'); // Duration in days
  const [shareLink, setShareLink] = useState('');

  // Sample data categories you may want to share
  const dataOptions = [
    { id: 'personalInfo', label: 'Personal Information' },
    { id: 'contact', label: 'Contact Information' },
    { id: 'education', label: 'Education' },
    { id: 'employment', label: 'Employment' },
    { id: 'financial', label: 'Financial Data' },
    { id: 'health', label: 'Health Information' },
    { id: 'preferences', label: 'Preferences & Lifestyle' },
    { id: 'socialFamily', label: 'Social & Family Data' },
  ];

  const handleDataSelection = (dataId) => {
    setSelectedData((prevSelected) =>
      prevSelected.includes(dataId)
        ? prevSelected.filter((id) => id !== dataId)
        : [...prevSelected, dataId]
    );
  };

  const handleDurationChange = (event) => {
    setShareDuration(event.target.value);
  };

  const handleShareData = async () => {
    try {
      const response = await axios.post('https://your-api-endpoint.com/api/share-data', {
        data: selectedData,
        duration: shareDuration,
      });

      // Assuming the response contains a share link
      setShareLink(response.data.shareLink);
    } catch (error) {
      console.error('Error sharing data:', error);
    }
  };

  return (
    <div className="data-share">
      <h2>Share Your Data</h2>
      <div>
        <h3>Select Data to Share:</h3>
        {dataOptions.map((option) => (
          <div key={option.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedData.includes(option.id)}
                onChange={() => handleDataSelection(option.id)}
              />
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <div>
        <h3>Duration (days):</h3>
        <select value={shareDuration} onChange={handleDurationChange}>
          <option value="1">1 day</option>
          <option value="7">1 week</option>
          <option value="30">1 month</option>
        </select>
      </div>
      <button onClick={handleShareData}>Share Data</button>
      {shareLink && (
        <div>
          <h3>Share Link:</h3>
          <a href={shareLink} target="_blank" rel="noopener noreferrer">{shareLink}</a>
        </div>
      )}
    </div>
  );
};

export default DataShare;
