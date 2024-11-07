import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles/FetchSharedDataPage.css';

const DataRetriever = () => {
  const { dataID } = useParams();
  const [retrievedData, setRetrievedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isObfuscated, setIsObfuscated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!dataID) return;

      setLoading(true);
      setError(null);
      setRetrievedData(null);

      try {
        const response = await axios.get(`https://login-9ebe.onrender.com/api/shared/get-data/${dataID}`);
        setRetrievedData(response.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to retrieve data. Please check the dataID and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataID]);

  // Prevent screenshot with obfuscation techniques
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' || document.visibilityState === 'unloaded') {
        // Obfuscate content if visibility changes
        setIsObfuscated(true);
      } else {
        // Remove obfuscation when returning
        setTimeout(() => setIsObfuscated(false), 300);
      }
    };

    const disableRightClick = (e) => e.preventDefault();
    const disableCopyShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        alert("Copying is disabled on this page.");
      }
    };

    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableCopyShortcut);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableCopyShortcut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const displayUserData = (data) => {
    const fields = [
      { label: "Full Name", value: data.fullName },
      { label: "Email", value: data.email },
      { label: "Phone Number", value: data.phoneNumber },
      { label: "Username", value: data.username },
      { label: "Date of Birth", value: data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : null },
      { label: "Gender", value: data.gender },
      { label: "Category", value: data.category },
      { label: "EID", value: data.eID },
      { label: "Verified", value: data.isVerified ? 'Yes' : 'No' },
      { label: "Active", value: data.active ? 'Yes' : 'No' }
    ].filter(field => field.value);

    if (fields.length === 0) return null;

    return (
      <div className={`fecd-section ${isObfuscated ? 'obfuscate' : ''}`}>
        <h3>User Information</h3>
        <ul className="fecd-list">
          {fields.map((field, index) => (
            <li key={index}>{field.label}: {field.value}</li>
          ))}
        </ul>
      </div>
    );
  };
  // Other display functions remain the same...
  const displayHealthData = (data) => {
    const healthFields = [
      { label: "Blood Type", value: data.bloodType },
      { label: "Allergies", value: data.allergies },
      { label: "Conditions", value: data.conditions },
      { label: "Disabilities", value: data.disabilities },
      { label: "Additional Info", value: data.additionalInfo }
    ].filter(field => field.value);

    const medicalHistory = Array.isArray(data.medicalHistory) && data.medicalHistory.length > 0;

    if (healthFields.length === 0 && !medicalHistory) return null;

    return (
      <div className="fecd-section">
        <h3>Health Information</h3>
        <ul className="fecd-list">
          {healthFields.map((field, index) => (
            <li key={index}>{field.label}: {field.value}</li>
          ))}
        </ul>
        {medicalHistory && (
          <>
            <h4 className="fecd-medical-history-title">Medical History</h4>
            <ul className="fecd-medical-history-list">
              {data.medicalHistory.map((item, index) => (
                <li key={index}>
                  {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown Date'}: {item.description || 'No Description'}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  const displayEducationData = (data) => {
    if (!Array.isArray(data.education) || data.education.length === 0) return null;

    return (
      <div className="fecd-section">
        <h3>Education Information</h3>
        <ul className="fecd-education-list">
          {data.education.map((item, index) => (
            <li key={index}>
              <strong>{item.degree}</strong> in {item.fieldOfStudy} from {item.institutionName}
              <br />
              {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const displayEmploymentData = (data) => {
    if (!Array.isArray(data.employment) || data.employment.length === 0) return null;

    return (
      <div className="fecd-section">
        <h3>Employment Information</h3>
        <ul className="fecd-employment-list">
          {data.employment.map((item, index) => (
            <li key={index}>
              {item.jobTitle} at {item.employer} ({item.jobCategory})
              <br />
              {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const displayFinanceData = (data) => {
    if (!Array.isArray(data.finance) || data.finance.length === 0) return null;

    return (
      <div className="fecd-section">
        <h3>Finance Information</h3>
        <ul className="fecd-finance-list">
          {data.finance.map((item, index) => (
            <li key={index}>
              Bank: {item.bankName || 'N/A'} - Account Number: {item.bankAccountNumber || 'N/A'}
              <br />
              Income: ${item.income || 'N/A'} - Credit Score: {item.creditScore || 'N/A'}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="fecd-container">
      <h2 className="fecd-header">Data Retriever</h2>

      {loading && <p className="fecd-loading">Loading...</p>}
      {error && <p className="fecd-error">{error}</p>}

      {retrievedData && (
        <div className="fecd-section">
          {displayUserData(retrievedData)}
          {displayHealthData(retrievedData)}
          {displayEducationData(retrievedData)}
          {displayEmploymentData(retrievedData)}
          {displayFinanceData(retrievedData)}
        </div>
      )}
    </div>
  );
};

export default DataRetriever;