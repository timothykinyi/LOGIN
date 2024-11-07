import axios from 'axios';
import React, { useState } from 'react';
import './styles/DataStoreForm.css';

const DataStoreForm = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [expiryDate, setExpiryDate] = useState('');
  const [viewOnce, setViewOnce] = useState(false);
  const [dataID, setDataID] = useState(''); // State to store the dataID for the link
  const eID = sessionStorage.getItem('eID');

  const sections = [
    {
      title: 'Basic Info',
      fields: [
        { label: 'Full Name', value: 'fullName' },
        { label: 'Email', value: 'email' },
        { label: 'Phone Number', value: 'phoneNumber' },
        { label: 'Username', value: 'username' },
        { label: 'Date of Birth', value: 'dateOfBirth' },
        { label: 'Gender', value: 'gender' },
        { label: 'Category', value: 'category' },
        { label: 'eID', value: 'eID' },
        { label: 'Is Verified', value: 'isVerified' },
        { label: 'Active Status', value: 'active' },
      ],
    },
    {
      title: 'Health Info',
      fields: [
        { label: 'Blood Type', value: 'bloodType' },
        { label: 'Allergies', value: 'allergies' },
        { label: 'Medical History', value: 'medicalHistory' },
        { label: 'Insurance Provider', value: 'insuranceProvider' },
        { label: 'Policy Number', value: 'policyNumber' },
        { label: 'Coverage Details', value: 'coverageDetails' },
        { label: 'Conditions', value: 'conditions' },
        { label: 'Disabilities', value: 'disabilities' },
        { label: 'Additional Health Info', value: 'additionalInfo' },
      ],
    },
    {
        title: 'Personal Info',
        fields: [
        { label: 'First Name', value: 'personalinfo.firstName' },
        { label: 'Last Name', value: 'personalinfo.lastName' },
        { label: 'Marital Status', value: 'personalinfo.maritalStatus' },
        { label: 'Nationality', value: 'personalinfo.nationality' },
        { label: 'Street Address 1', value: 'personalinfo.streetAddress1' },
        { label: 'Street Address 2', value: 'personalinfo.streetAddress2' },
        { label: 'City', value: 'personalinfo.city' },
        { label: 'State', value: 'personalinfo.state' },
        { label: 'Postal Code', value: 'personalinfo.postalCode' },
        { label: 'Country', value: 'personalinfo.country' },
        ],
      },
      {
        title: 'Contacts Info',
        fields: [
        { label: 'Phone Numbers', value: 'contacts.phoneNumbers' },
        { label: 'Emails', value: 'contacts.emails' },
        { label: 'Emergency Contacts', value: 'contacts.emergencyContacts' },
        { label: 'Social Media Accounts', value: 'contacts.socialMedia' },
        ],
      },
      {
        title: 'Education Info',
        fields: [
        { label: 'Education Level', value: 'education.educationLevel' },
        { label: 'Institution Name', value: 'education.institutionName' },
        { label: 'Degree Type', value: 'education.degreeType' },
        { label: 'Field of Study', value: 'education.fieldOfStudy' },
        { label: 'Start Date', value: 'education.startDate' },
        { label: 'End Date', value: 'education.endDate' },
        ],
      },
      {
        title: 'Employment Info',
        fields: [
        { label: 'Job Title', value: 'employment.jobTitle' },
        { label: 'Employer', value: 'employment.employer' },
        { label: 'Job Category', value: 'employment.jobCategory' },
        { label: 'Skills', value: 'employment.skills' },
        ],
      },
      {
        title: 'Preferences Info',
        fields: [
        { label: 'Hobbies', value: 'hobbies' },
        { label: 'Dietary Preference', value: 'preference.dietaryPreference' },
        { label: 'Religious Affiliation', value: 'preference.religiousAffiliation' },
        { label: 'Favorite Cuisine', value: 'preference.favoriteCuisine' },
        { label: 'Sleep Preference', value: 'preference.sleepPreference' },
        { label: 'Pet Preference', value: 'preference.petPreference' },
        ],
      },
      {
        title: 'Finance Info',
        fields: [
        { label: 'Bank Account Number', value: 'finance.bankAccountNumber' },
        { label: 'Bank Name', value: 'finance.bankName' },
        { label: 'Income', value: 'finance.income' },
        { label: 'Credit Score', value: 'finance.creditScore' },
        { label: 'Tax ID', value: 'finance.taxId' },
        ],
      },
  ];

  const handleFieldChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedFields((prevFields) => [...prevFields, value]);
    } else {
      setSelectedFields((prevFields) => prevFields.filter((field) => field !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://login-9ebe.onrender.com/api/shared/share-data', {
        selectedFields,
        expiryDate,
        viewOnce,
        eID,
      });
      if (response.status === 200) {
        alert(response.data.message);
        setDataID(response.data.DataID); // Set the dataID from the backend response
      } else {
        alert('Failed to store data.');
      }
    } catch (error) {
      console.error('Error storing user data:', error);
      alert('Failed to store data.');
    }
  };

  const goToNextSection = () => {
    setCurrentSection((prevSection) => Math.min(prevSection + 1, sections.length - 1));
  };

  const goToPreviousSection = () => {
    setCurrentSection((prevSection) => Math.max(prevSection - 1, 0));
  };

  const handleViewOnceChange = () => {
    setViewOnce(!viewOnce);
    if (!viewOnce) {
      setExpiryDate('');
    }
  };

  const handleExpiryDateChange = (e) => {
    setExpiryDate(e.target.value);
    setViewOnce(false);
  };

  return (
    <div className="cnd-form-container">
      <h2 className="cnd-heading">Select the data you want to share</h2>
      <form className="cnd-form" onSubmit={handleSubmit}>
        {sections.map((section, index) => (
          <div
            key={section.title}
            style={{ display: currentSection === index ? 'block' : 'none' }}
          >
            <h3 className="cnd-subheading">{section.title}</h3>
            {section.fields.map((field) => (
              <div className="cnd-checkbox-container" key={field.value}>
                <label className="cnd-checkbox-label">
                  <input
                    type="checkbox"
                    value={field.value}
                    onChange={handleFieldChange}
                    className="cnd-checkbox-input"
                  />
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        ))}

        <div className="cnd-navigation-buttons">
          <button
            type="button"
            onClick={goToPreviousSection}
            disabled={currentSection === 0}
            className="cnd-back-button"
          >
            Back
          </button>
          {currentSection < sections.length - 1 && (
            <button type="button" onClick={goToNextSection} className="cnd-next-button">
              Next
            </button>
          )}
        </div>

        <div className="cnd-expiry-section">
          <h3 className="cnd-subheading">Data Expiry</h3>
          <label className="cnd-expiry-label">
            Expiry Date & Time:
            <input
              type="datetime-local"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              disabled={viewOnce}
              className="cnd-expiry-input"
            />
          </label>
          <label className="cnd-view-once-label">
            <input
              type="checkbox"
              checked={viewOnce}
              onChange={handleViewOnceChange}
              className="cnd-view-once-checkbox"
            />
            View Once
          </label>
        </div>
        
        <div className="cnd-submit-container">
          <button type="submit" className="cnd-submit-button">Store Selected Data</button>
        </div>
      </form>

      {dataID && (
        <div className="cnd-sharable-link-section">
          <h3 className="cnd-sharable-link-heading">Your Sharable Link</h3>
          <p className="cnd-sharable-link">
            <a href={`https://own-my-data.web.app/sharedlink/${dataID}`} target="_blank" rel="noopener noreferrer">
              https://own-my-data.web.app/sharedlink/{dataID}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default DataStoreForm;
