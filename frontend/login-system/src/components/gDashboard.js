// DataShare.js

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/DataShare.css'; // Adjust the path as needed

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [shareableLink, setShareableLink] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const eID = sessionStorage.getItem('eID');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://login-9ebe.onrender.com/api/auth/user/${eID}`);
        console.log(response.data); // Consider removing this in production
        setUser(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Server error');
      }
    };

    fetchUserData();
  }, [eID]);

  // Toggle the selected state of each field
  const handleCheckboxChange = (field, value) => {
    setSelectedData(prevState => ({
      ...prevState,
      [field]: prevState[field] ? undefined : value,
    }));
  };

  // Submit selected data
  const shareSelectedData = async () => {
    try {
      const response = await axios.post('https://login-9ebe.onrender.com/api/shared/share', {
        selectedData,
        eID,
        deadlineDate
      });
      setShareableLink(`https://own-my-data.web.app/sharedlink/${response.data.id}`);
    } catch (err) {
      setError('Failed to share data.');
    }
  };

  if (error) return <div className="dts-error">Error: {error}</div>;
  if (!user) return <div className="dts-loading">Loading...</div>;

  return (
    <div className="dts-user-profile">
      <h1 className="dts-header">Select the data you want to share</h1>

      <div className="dts-profile-section">
        {/* Display user details without showing sensitive IDs */}
        <p className="dts-field">
          <input type="checkbox" onChange={() => handleCheckboxChange('fullName', user.fullName)} />
          {user.fullName || "Full Name Not Available"}
        </p>
        
        <p className="dts-field">
          <input type="checkbox" onChange={() => handleCheckboxChange('email', user.email)} />
          <strong>Email:</strong> {user.email || "Email Not Available"}
        </p>
        
        <p className="dts-field">
          <input type="checkbox" onChange={() => handleCheckboxChange('username', user.username)} />
          <strong>Username:</strong> {user.username || "Username Not Available"}
        </p>

        <p className="dts-field">
          <input type="checkbox" onChange={() => handleCheckboxChange('phoneNumber', user.phoneNumber)} />
          <strong>Phone Number:</strong> {user.phoneNumber || "Phone Number Not Available"}
        </p>

        <p className="dts-field">
          <input type="checkbox" onChange={() => handleCheckboxChange('dateOfBirth', user.dateOfBirth)} />
          <strong>Date of Birth:</strong> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "DOB Not Available"}
        </p>
        
        {/* Health Model */}
        <h3 className="dts-section-header">Health Information</h3>
        <p className="dts-field">
          <input type="checkbox" onChange={() => handleCheckboxChange('bloodType', user.bloodType)} />
          <strong>Blood Type:</strong> {user.bloodType || "Blood Type Not Available"}
        </p>
        
        <p className="dts-field">
          <input type="checkbox" onChange={() => handleCheckboxChange('allergies', user.allergies)} />
          <strong>Allergies:</strong> {user.allergies || "No Allergies Noted"}
        </p>

        {/* Medical History */}
        {user.medicalHistory && user.medicalHistory.length > 0 ? (
          <div className="dts-medical-history">
            <h4 className="dts-subsection-header">Medical History:</h4>
            {user.medicalHistory.map((item, index) => (
              <div key={index} className="dts-history-item">
                <p className="dts-field">
                  <input type="checkbox" onChange={() => handleCheckboxChange(`medicalHistory-${index}`, item)} />
                  <strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : "Date Not Available"}
                </p>
                <p className="dts-field"><strong>Description:</strong> {item.description || "Description Not Available"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="dts-no-data">No Medical History Available.</p>
        )}

        {/* Insurance Information */}
        <h3 className="dts-section-header">Insurance Information</h3>
        {['insuranceProvider', 'policyNumber', 'coverageDetails', 'conditions', 'disabilities', 'additionalInfo'].map(field => (
          <div key={field} className="dts-field">
            <label>
              <input
                type="checkbox"
                onChange={(e) => handleCheckboxChange(field, e.target.checked ? user[field] : null)}
              />
              <strong>{field.replace(/([A-Z])/g, ' $1')}: </strong>
              {user[field] || `${field} Not Available`}
            </label>
          </div>
        ))}

        {/* Personal Information */}
        <h3 className="dts-section-header">Personal Information</h3>
        {user.personalinfo && user.personalinfo.length > 0 ? (
          user.personalinfo.map((info, index) => (
            <div key={index}>
              {['firstName', 'lastName', 'dateOfBirth', 'gender', 'maritalStatus', 'nationality', 'streetAddress1', 'streetAddress2', 'city', 'state', 'postalCode', 'country'].map(field => (
                <div key={field} className="dts-field">
                  <label>
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(`personalinfo_${index}`, field, e.target.checked ? info[field] : null)}
                    />
                    <strong>{field.replace(/([A-Z])/g, ' $1')}: </strong>
                    {info[field] || `${field} Not Available`}
                  </label>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="dts-no-data">No Personal Information Available.</p>
        )}

        {/* Contacts */}
        <h3 className="dts-section-header">Contacts</h3>
        {user.contacts && user.contacts.length > 0 ? (
          user.contacts.map((contact, index) => (
            <div key={index}>
              <h4 className="dts-subheader">Contact {index + 1}</h4>
              {['phoneNumbers', 'emails', 'emergencyContacts', 'socialMedia', 'address'].map(field => (
                <div key={field} className="dts-field">
                  <label>
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(`contacts_${index}`, field, e.target.checked ? contact[field] : null)}
                    />
                    <strong>{field.replace(/([A-Z])/g, ' $1')}: </strong>
                    {contact[field] ? contact[field].join(', ') : `${field} Not Available`}
                  </label>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="dts-no-data">No Contacts Available.</p>
        )}

        {/* Education */}
        <h3 className="dts-section-header">Education</h3>
        {user.education && user.education.length > 0 ? (
          user.education.map((edu, index) => (
            <div key={index}>
              {['educationLevel', 'institutionName', 'degreeType', 'degree', 'fieldOfStudy', 'startDate', 'endDate', 'country', 'transferDetails'].map(field => (
                <div key={field} className="dts-field">
                  <label>
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(`education_${index}`, field, e.target.checked ? edu[field] : null)}
                    />
                    <strong>{field.replace(/([A-Z])/g, ' $1')}: </strong>
                    {edu[field] || `${field} Not Available`}
                  </label>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="dts-no-data">No Education Information Available.</p>
        )}

        {/* Employment */}
        <h3 className="dts-section-header">Employment</h3>
        {user.employment && user.employment.length > 0 ? (
          user.employment.map((job, index) => (
            <div key={index}>
              {['employerName', 'jobTitle', 'startDate', 'endDate', 'responsibilities', 'achievements'].map(field => (
                <div key={field} className="dts-field">
                  <label>
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(`employment_${index}`, field, e.target.checked ? job[field] : null)}
                    />
                    <strong>{field.replace(/([A-Z])/g, ' $1')}: </strong>
                    {job[field] || `${field} Not Available`}
                  </label>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="dts-no-data">No Employment Information Available.</p>
        )}
      </div>

      {/* Deadline Input */}
      <div className="dts-deadline-section">
        <label htmlFor="deadline">Deadline:</label>
        <input
          type="datetime-local"
          id="deadline"
          value={deadlineDate}
          onChange={(e) => setDeadlineDate(e.target.value)}
        />
      </div>

      <button className="dts-share-button" onClick={shareSelectedData}>Share Data</button>

      {shareableLink && (
        <div className="dts-shareable-link">
          <strong>Shareable Link:</strong> <a href={shareableLink}>{shareableLink}</a>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
