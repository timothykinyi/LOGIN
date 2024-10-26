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
        console.log(response.data);
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

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h1>User Profile</h1>

      {/* Deadline input */}
      <label>
        Deadline:
        <input
          type="date"
          value={deadlineDate}
          onChange={(e) => setDeadlineDate(e.target.value)}
        />
      </label>

      <div>
        <h2>
          <input type="checkbox" onChange={() => handleCheckboxChange('fullName', user.fullName)} />
          {user.fullName || "Full Name Not Available"}
        </h2>
        
        <p>
          <input type="checkbox" onChange={() => handleCheckboxChange('email', user.email)} />
          <strong>Email:</strong> {user.email || "Email Not Available"}
        </p>
        
        <p>
          <input type="checkbox" onChange={() => handleCheckboxChange('username', user.username)} />
          <strong>Username:</strong> {user.username || "Username Not Available"}
        </p>

        <p>
          <input type="checkbox" onChange={() => handleCheckboxChange('phoneNumber', user.phoneNumber)} />
          <strong>Phone Number:</strong> {user.phoneNumber || "Phone Number Not Available"}
        </p>

        <p>
          <input type="checkbox" onChange={() => handleCheckboxChange('dateOfBirth', user.dateOfBirth)} />
          <strong>Date of Birth:</strong> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "DOB Not Available"}
        </p>
        
        {/* Health Model */}
        <h3>Health Information</h3>
        <p>
          <input type="checkbox" onChange={() => handleCheckboxChange('bloodType', user.bloodType)} />
          <strong>Blood Type:</strong> {user.bloodType || "Blood Type Not Available"}
        </p>
        
        <p>
          <input type="checkbox" onChange={() => handleCheckboxChange('allergies', user.allergies)} />
          <strong>Allergies:</strong> {user.allergies || "No Allergies Noted"}
        </p>

        {/* Medical History */}
        {user.medicalHistory && user.medicalHistory.length > 0 ? (
          <div>
            <h4>Medical History:</h4>
            {user.medicalHistory.map((item, index) => (
              <div key={index}>
                <p>
                  <input type="checkbox" onChange={() => handleCheckboxChange(`medicalHistory-${index}`, item)} />
                  <strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : "Date Not Available"}
                </p>
                <p><strong>Description:</strong> {item.description || "Description Not Available"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No Medical History Available.</p>
        )}

      {/* Insurance Information */}
      <h3>Insurance Information</h3>
      {['insuranceProvider', 'policyNumber', 'coverageDetails', 'conditions', 'disabilities', 'additionalInfo'].map(field => (
        <div key={field}>
          <label>
            <input
              type="checkbox"
              onChange={(e) => handleCheckboxChange('insurance', field, e.target.checked ? user[field] : null)}
            />
            <strong>{field.replace(/([A-Z])/g, ' $1')}: </strong>
            {user[field] || `${field} Not Available`}
          </label>
        </div>
      ))}

      {/* Personal Information */}
      <h3>Personal Information</h3>
      {user.personalinfo && user.personalinfo.length > 0 ? (
        user.personalinfo.map((info, index) => (
          <div key={index}>
            {['firstName', 'lastName', 'dateOfBirth', 'gender', 'maritalStatus', 'nationality', 'streetAddress1', 'streetAddress2', 'city', 'state', 'postalCode', 'country'].map(field => (
              <div key={field}>
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
        <p>No Personal Information Available.</p>
      )}

      {/* Contacts */}
      <h3>Contacts</h3>
      {user.contacts && user.contacts.length > 0 ? (
        user.contacts.map((contact, index) => (
          <div key={index}>
            <h4>Contact {index + 1}</h4>
            {['phoneNumbers', 'emails', 'emergencyContacts', 'socialMedia', 'address'].map((field) => (
              <div key={field}>
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(`contacts_${index}`, field, e.target.checked ? contact[field] : null)}
                  />
                  <strong>{field.replace(/([A-Z])/g, ' $1')}: </strong>
                  {contact[field] ? contact[field].map(item => `${item}`).join(', ') : `${field} Not Available`}
                </label>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No Contacts Available.</p>
      )}

            {/* Education */}
            <h3>Education</h3>
      {user.education && user.education.length > 0 ? (
        user.education.map((edu, index) => (
          <div key={index}>
            {['educationLevel', 'institutionName', 'degreeType', 'degree', 'fieldOfStudy', 'startDate', 'endDate', 'country', 'transferDetails'].map(field => (
              <div key={field}>
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
        <p>No Education Information Available.</p>
      )}

      {/* Employment */}
      <h3>Employment</h3>
      {user.employment && user.employment.length > 0 ? (
        user.employment.map((job, index) => (
          <div key={index}>
            {['jobTitle', 'company', 'startDate', 'endDate', 'country', 'transferDetails'].map(field => (
              <div key={field}>
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
        <p>No Employment Information Available.</p>
      )}

      {/* Preferences */}
      <h3>Preferences</h3>
      {user.preference && user.preference.length > 0 ? (
        user.preference.map((pref, index) => (
          <div key={index}>
            {['hobbies', 'dietaryPreference', 'religiousAffiliation', 'selectedHobbies', 'selectedActivities', 'selectedMusicGenres', 'favoriteCuisine', 'sleepPreference', 'petPreference', 'environmentalPractices'].map(field => (
              <div key={field}>
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(`preference_${index}`, field, e.target.checked ? (Array.isArray(pref[field]) ? pref[field].join(', ') : pref[field]) : null)}
                  />
                  <strong>{field.replace(/([A-Z])/g, ' $1')}: </strong>
                  {Array.isArray(pref[field]) ? pref[field].join(', ') : pref[field] || `${field} Not Available`}
                </label>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No Preference Information Available.</p>
      )}

      {/* Finance */}
      <h3>Finance</h3>
      {user.finance && user.finance.length > 0 ? (
        user.finance.map((fin, index) => (
          <div key={index}>
            {['bankAccountNumber', 'bankName', 'income', 'creditScore', 'taxId', 'mobileNumber'].map(field => (
              <div key={field}>
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(`finance_${index}`, field, e.target.checked ? fin[field] : null)}
                  />
                  <strong>{field.replace(/([A-Z])/g, ' $1')}: </strong>
                  {fin[field] || "Not specified."}
                </label>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No finance information available.</p>
      )}

      {/* Social Information */}
      <h3>Social Information</h3>
      {user.social && user.social.length > 0 ? (
        user.social.map((social, index) => (
          <div key={index}>
            {['platform', 'username', 'friends', 'followers'].map(field => (
              <div key={field}>
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(`social_${index}`, field, e.target.checked 
                      ? (Array.isArray(social[field]) ? social[field].join(', ') : social[field])
                      : null)}
                  />
                  <strong>{field.replace(/([A-Z])/g, ' $1')}: </strong>
                  {Array.isArray(social[field]) ? social[field].join(', ') : (social[field] || "Not specified.")}
                </label>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No social information available.</p>
      )}

        {/* Add other fields similarly with checkboxes */}
      </div>

      <button onClick={shareSelectedData}>Share Selected Data</button>
      {shareableLink && <p>Shareable Link: <a href={shareableLink}>{shareableLink}</a></p>}
    </div>
  );
};

export default UserProfile;
