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
  const [selectedData, setSelectedData] = useState({});
  const [shareableLink, setShareableLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleSelectData = (category, itemId, value) => {
    setSelectedData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [itemId]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!Object.keys(selectedData).length) {
      alert('Please select at least one item to share.');
      return;
    }

    const confirmSubmit = window.confirm('Are you sure you want to share the selected data?');
    if (!confirmSubmit) return;

    try {
      const response = await axios.post('https://login-9ebe.onrender.com/api/shared/share', { selectedData, eID });
      setShareableLink(`'https://login-9ebe.onrender.com/api/shared/shared-data/${response.data.id}`);
    } catch (error) {
      console.error('Error sharing data:', error);
      setError('Failed to share data. Please try again later.');
    }
  };

  const handleClearSelection = () => {
    setSelectedData({});
  };

  return (
    <div className="data-share-container" style={{ backgroundColor: 'blueviolet', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: 'white' }}>Select Data to Share</h2>
      
      {loading && <p style={{ color: 'yellow' }}>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && (
        <>
          <h3 style={{ color: 'lightgray' }}>Contact Information</h3>
          {contacts.map(contact => (
            <div key={contact._id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.contacts?.[contact._id]}
                  onChange={e => handleSelectData('contacts', contact._id, e.target.checked)}
                />
                {contact.phoneNumbers.map(num => num.number).join(', ')}
              </label>
            </div>
          ))}
          
          <h3 style={{ color: 'lightgray' }}>Education Data</h3>
          {educationData.map(education => (
            <div key={education._id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.education?.[education._id]}
                  onChange={e => handleSelectData('education', education._id, e.target.checked)}
                />
                {education.institutionName} ({education.degree})
              </label>
            </div>
          ))}
          
          <h3 style={{ color: 'lightgray' }}>Employment Data</h3>
          {employmentData.map(employment => (
            <div key={employment._id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.employment?.[employment._id]}
                  onChange={e => handleSelectData('employment', employment._id, e.target.checked)}
                />
                {employment.jobTitle} at {employment.employer}
              </label>
            </div>
          ))}
          
          <h3 style={{ color: 'lightgray' }}>Financial Data</h3>
          {financialData.map(financial => (
            <div key={financial._id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.financial?.[financial._id]}
                  onChange={e => handleSelectData('financial', financial._id, e.target.checked)}
                />
                {financial.bankName}
              </label>
            </div>
          ))}
          
          <h3 style={{ color: 'lightgray' }}>Health Data</h3>
          {healthData.map(health => (
            <div key={health._id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.health?.[health._id]}
                  onChange={e => handleSelectData('health', health._id, e.target.checked)}
                />
                Blood Type: {health.bloodType}
              </label>
            </div>
          ))}
          
          <h3 style={{ color: 'lightgray' }}>Personal Information</h3>
          {personalInfoList.map(personal => (
            <div key={personal._id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.personal?.[personal._id]}
                  onChange={e => handleSelectData('personal', personal._id, e.target.checked)}
                />
                {personal.firstName} {personal.lastName}
              </label>
            </div>
          ))}
          
          <h3 style={{ color: 'lightgray' }}>Preferences</h3>
          {preferences.map(preference => (
            <div key={preference._id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.preferences?.[preference._id]}
                  onChange={e => handleSelectData('preferences', preference._id, e.target.checked)}
                />
                {preference.favoriteCuisine}
              </label>
            </div>
          ))}
          
          <h3 style={{ color: 'lightgray' }}>Social Family Data</h3>
          {socialFamilyData.map(family => (
            <div key={family._id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedData.socialFamily?.[family._id]}
                  onChange={e => handleSelectData('socialFamily', family._id, e.target.checked)}
                />
                Marital Status: {family.maritalStatus}
              </label>
            </div>
          ))}

          <button onClick={handleClearSelection} style={{ margin: '10px', padding: '10px', backgroundColor: 'red', color: 'white' }}>
            Clear All Selections
          </button>

          <button onClick={handleSubmit} style={{ margin: '10px', padding: '10px', backgroundColor: 'green', color: 'white' }}>
            Share Selected Data
          </button>

          {shareableLink && <p>Shareable Link: <a href={shareableLink}>{shareableLink}</a></p>}
        </>
      )}
    </div>
  );
};

export default DataShareComponent;
