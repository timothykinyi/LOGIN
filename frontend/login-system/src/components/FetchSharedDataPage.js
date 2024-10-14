import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles/FetchSharedDataPage.css';
const FetchSharedDataPage = () => {
  const { eID } = useParams();
  const [sharedData, setSharedData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://login-9ebe.onrender.com/api/shared/shared-data/${eID}`);
        console.log('Fetched data:', response.data);
        setSharedData(response.data[0] || response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch shared data. Please check the link or try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (eID) {
      fetchData();
    } else {
      setError('Invalid eID in the URL');
    }
  }, [eID]);

  return (
    <div className="shr-container">
      <h2 className="shr-title">Fetch Shared Data</h2>

      {loading && <p className="shr-loading">Loading data...</p>}
      {error && <p className="shr-error">{error}</p>}

      {sharedData && !loading && (
        <div className="shr-data-card">
          <h3 className="shr-data-title">Shared Data</h3>

          {sharedData.accessExpired ? (
            <p className="shr-expired-message">{sharedData.message}</p>
          ) : (
            <div className="shr-data-section">
              {sharedData.sharedData?.contacts && (
                <>
                  <h4 className="shr-section-title">Contact Information</h4>
                  <ul className="shr-list">
                    {Object.values(sharedData.sharedData.contacts).map((contact, index) => (
                      <li key={index} className="shr-list-item">
                        Phone: {contact.phoneNumbers?.map(num => num.number).join(', ')} <br />
                        Email: {contact.emails?.map(email => email.email).join(', ')} <br />
                        Emergency Contact: {contact.emergencyContacts?.map(ec => `${ec.name} (${ec.phone})`).join(', ')} <br />
                        Social Media: {contact.socialMedia?.map(sm => `${sm.platform}: ${sm.username}`).join(', ')}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {sharedData.sharedData?.employment && (
                <>
                  <h4 className="shr-section-title">Employment Data</h4>
                  <ul className="shr-list">
                    {Object.values(sharedData.sharedData.employment).map((job, index) => (
                      <li key={index} className="shr-list-item">
                        Job Title: {job.jobTitle} <br />
                        Employer: {job.employer} <br />
                        Category: {job.jobCategory} <br />
                        Skills: {job.skills} <br />
                        Start Date: {new Date(job.startDate).toLocaleDateString()} <br />
                        End Date: {new Date(job.endDate).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {sharedData.sharedData?.health && (
                <>
                  <h4 className="shr-section-title">Health Information</h4>
                  <ul className="shr-list">
                    {Object.values(sharedData.sharedData.health).map((healthInfo, index) => (
                      <li key={index} className="shr-list-item">
                        Blood Type: {healthInfo.bloodType} <br />
                        Allergies: {healthInfo.allergies} <br />
                        Medical History: {healthInfo.medicalHistory?.map(hist => `${new Date(hist.date).toLocaleDateString()}: ${hist.description}`).join(', ')} <br />
                        Insurance: {healthInfo.insuranceProvider} <br />
                        Policy Number: {healthInfo.policyNumber}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {sharedData.sharedData?.personal && (
                <>
                  <h4 className="shr-section-title">Personal Information</h4>
                  <ul className="shr-list">
                    {Object.values(sharedData.sharedData.personal).map((person, index) => (
                      <li key={index} className="shr-list-item">
                        Name: {person.firstName} {person.lastName} <br />
                        Date of Birth: {new Date(person.dateOfBirth).toLocaleDateString()} <br />
                        Gender: {person.gender} <br />
                        Nationality: {person.nationality} <br />
                        Address: {person.streetAddress1}, {person.city}, {person.country}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {sharedData.sharedData?.preferences && (
                <>
                  <h4 className="shr-section-title">Preferences</h4>
                  <ul className="shr-list">
                    {Object.values(sharedData.sharedData.preferences).map((pref, index) => (
                      <li key={index} className="shr-list-item">
                        Dietary Preferences: {pref.dietaryPreference} <br />
                        Religious Affiliation: {pref.religiousAffiliation} <br />
                        Hobbies: {pref.selectedHobbies?.join(', ')} <br />
                        Music Genres: {pref.selectedMusicGenres?.join(', ')} <br />
                        Favorite Cuisine: {pref.favoriteCuisine}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {sharedData.sharedData?.socialFamily && (
                <>
                  <h4 className="shr-section-title">Social & Family Information</h4>
                  <ul className="shr-list">
                    {Object.values(sharedData.sharedData.socialFamily).map((family, index) => (
                      <li key={index} className="shr-list-item">
                        Marital Status: {family.maritalStatus} <br />
                        Family Members: {family.familyMembers?.map(member => `${member.name} (${member.relationship})`).join(', ')} <br />
                        Social Affiliations: {family.socialAffiliations?.map(aff => `${aff.organization} (${aff.role})`).join(', ')}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FetchSharedDataPage;
