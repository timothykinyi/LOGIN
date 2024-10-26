import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/DataShare.css'; // Adjust the path as needed

const DataShareComponent = () => {
  const [contacts, setContacts] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [employmentData, setEmploymentData] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [personalInfoList, setPersonalInfoList] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [socialFamilyData, setSocialFamilyData] = useState([]);
  const [selectedData, setSelectedData] = useState({
    contacts: {},
    education: {},
    employment: {},
    financial: {},
    health: {},
    personal: {},
    preferences: {},
    socialFamily: {}
  });
  const [shareableLink, setShareableLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deadlineDate, setDeadlineDate] = useState(''); // New state for deadline
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');

    if (!eID || !token) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [contactResponse, educationResponse, employmentResponse, financialResponse, healthResponse, personalResponse, preferencesResponse, socialFamilyResponse] = await Promise.all([
          axios.get('https://login-9ebe.onrender.com/api/contact'),
          axios.get('https://login-9ebe.onrender.com/api/education/all'),
          axios.get('https://login-9ebe.onrender.com/api/employment'),
          axios.get('https://login-9ebe.onrender.com/api/financial/all'),
          axios.get('https://login-9ebe.onrender.com/api/health/all'),
          axios.get('https://login-9ebe.onrender.com/api/personal-info'),
          axios.get('https://login-9ebe.onrender.com/api/preferences/all'),
          axios.get('https://login-9ebe.onrender.com/api/social-family/all'),
        ]);

        setContacts(contactResponse.data.filter(contact => contact.eID === parseInt(eID)));
        setEducationData(educationResponse.data.data.filter(edu => edu.eID === parseInt(eID)));
        setEmploymentData(employmentResponse.data.data.filter(emp => emp.eID === parseInt(eID)));
        setFinancialData(financialResponse.data.data.filter(fin => fin.eID === parseInt(eID)));
        setHealthData(healthResponse.data.data.filter(health => health.eID === parseInt(eID)));
        setPersonalInfoList(personalResponse.data.data.filter(personal => personal.eID === parseInt(eID)));
        setPreferences(preferencesResponse.data.data.filter(preference => preference.eID === parseInt(eID)));
        setSocialFamilyData(socialFamilyResponse.data.data.filter(family => family.eID === parseInt(eID)));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, eID]);

  const handleSelectData = (category, item, isSelected) => {
    setSelectedData(prev => {
      const updatedCategory = { ...prev[category] };
      if (isSelected) {
        // Add the entire item to the selected data
        updatedCategory[item._id] = item;
      } else {
        // Remove the item from selected data
        delete updatedCategory[item._id];
      }
      return { ...prev, [category]: updatedCategory };
    });
  };

  const handleSubmit = async () => {
    if (!Object.keys(selectedData).some(cat => Object.keys(selectedData[cat]).length > 0)) {
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
    setSelectedData({
      contacts: {},
      education: {},
      employment: {},
      financial: {},
      health: {},
      personal: {},
      preferences: {},
      socialFamily: {}
    });
    setDeadlineDate(''); // Clear the deadline date
  };

  return (
    <div className="data-share-container">
      <h2 className="section-title">Select Data to Share</h2>
      
      {loading && <p className="loading-message">Loading data...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && (
        <>
          
          {contacts.map(contact => (
            <div key={contact._id} className="data-item">
              <h3 className="data-section-title">Contact Information</h3>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.contacts[contact._id]}
                  onChange={e => handleSelectData('contacts', contact, e.target.checked)}
                />
                {contact.phoneNumbers.map(num => num.number).join(', ')}
              </label>
            </div>
          ))}
          
          
          {educationData.map(education => (
            <div key={education._id} className="data-item">
              <h3 className="data-section-title">Education Data</h3>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.education[education._id]}
                  onChange={e => handleSelectData('education', education, e.target.checked)}
                />
                {education.institutionName} ({education.degree})
              </label>
            </div>
          ))}
          
          
          {employmentData.map(employment => (
            <div key={employment._id} className="data-item">
              <h3 className="data-section-title">Employment Data</h3>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.employment[employment._id]}
                  onChange={e => handleSelectData('employment', employment, e.target.checked)}
                />
                {employment.jobTitle} at {employment.employer}
              </label>
            </div>
          ))}
          
          
          {financialData.map(financial => (
            <div key={financial._id} className="data-item">
              <h3 className="data-section-title">Financial Data</h3>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.financial[financial._id]}
                  onChange={e => handleSelectData('financial', financial, e.target.checked)}
                />
                {financial.bankName}
              </label>
            </div>
          ))}
          
          
          {healthData.map(health => (
            <div key={health._id} className="data-item">
              <h3 className="data-section-title">Health Data</h3>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.health[health._id]}
                  onChange={e => handleSelectData('health', health, e.target.checked)}
                />
                Blood Type: {health.bloodType}
              </label>
            </div>
          ))}
          
          
          {personalInfoList.map(personal => (
            <div key={personal._id} className="data-item">
              <h3 className="data-section-title">Personal Information</h3>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.personal[personal._id]}
                  onChange={e => handleSelectData('personal', personal, e.target.checked)}
                />
                {personal.firstName} {personal.lastName}
              </label>
            </div>
          ))}
          
          
          {preferences.map(preference => (
            <div key={preference._id} className="data-item">
              <h3 className="data-section-title">Preferences</h3>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.preferences[preference._id]}
                  onChange={e => handleSelectData('preferences', preference, e.target.checked)}
                />
                {preference.favoriteCuisine}
              </label>
            </div>
          ))}
          
          
          {socialFamilyData.map(family => (
            <div key={family._id} className="data-item">
              <h3 className="data-section-title">Social Family Data</h3>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.socialFamily[family._id]}
                  onChange={e => handleSelectData('socialFamily', family, e.target.checked)}
                />
                Marital Status: {family.maritalStatus}
              </label>
            </div>
          ))}
  
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
            <button className="sign-in-btn"onClick={handleClearSelection}>
              Clear All Selections
            </button>
    
            <button className="sign-in-btn" onClick={handleSubmit}>
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
