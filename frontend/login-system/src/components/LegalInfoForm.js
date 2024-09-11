import axios from 'axios';
import React, { useState } from 'react';
import './styles/LegalInfoForm.css'; // Ensure to import the CSS file

const LegalInfoForm = () => {
  const [criminalRecord, setCriminalRecord] = useState('');
  const [contracts, setContracts] = useState('');
  const [agreements, setAgreements] = useState('');
  const [legalDisputes, setLegalDisputes] = useState('');
  const [uploadRecords, setUploadRecords] = useState(null);
  const [uploadContracts, setUploadContracts] = useState(null);
  const [uploadAgreements, setUploadAgreements] = useState(null);
  const [uploadDisputes, setUploadDisputes] = useState(null);
  const [responseMessage, setResponseMessage] = useState(''); // State to store the server response
  const [errorMessage, setErrorMessage] = useState(''); // State to store any errors

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a FormData object to include the file uploads
    const formData = new FormData();
    formData.append('criminalRecord', criminalRecord);
    formData.append('contracts', contracts);
    formData.append('agreements', agreements);
    formData.append('legalDisputes', legalDisputes);
    if (uploadRecords) formData.append('uploadRecords', uploadRecords);
    if (uploadContracts) formData.append('uploadContracts', uploadContracts);
    if (uploadAgreements) formData.append('uploadAgreements', uploadAgreements);
    if (uploadDisputes) formData.append('uploadDisputes', uploadDisputes);

    try {
      // Make a POST request to the backend
      const response = await axios.post('YOUR_BACKEND_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Handle successful response
      setResponseMessage('Form submitted successfully!');
      console.log(response.data);
    } catch (error) {
      // Handle error response
      setErrorMessage('An error occurred while submitting the form.');
      console.error(error);
    }
  };

  return (
    <form className="legal-info-form" onSubmit={handleSubmit}>
      <h2>Legal Information Form</h2>

      {/* Criminal Record */}
      <div className="form-group">
        <label htmlFor="criminalRecord">Criminal Record:</label>
        <textarea
          id="criminalRecord"
          name="criminalRecord"
          rows="4"
          value={criminalRecord}
          onChange={(e) => setCriminalRecord(e.target.value)}
          placeholder="Describe any criminal records..."
        ></textarea>
        <input
          type="file"
          id="uploadRecords"
          name="uploadRecords"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={(e) => handleFileChange(e, setUploadRecords)}
        />
      </div>

      {/* Contracts */}
      <div className="form-group">
        <label htmlFor="contracts">Contracts and Agreements:</label>
        <textarea
          id="contracts"
          name="contracts"
          rows="4"
          value={contracts}
          onChange={(e) => setContracts(e.target.value)}
          placeholder="Describe any relevant contracts and agreements..."
        ></textarea>
        <input
          type="file"
          id="uploadContracts"
          name="uploadContracts"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={(e) => handleFileChange(e, setUploadContracts)}
        />
      </div>

      {/* Additional Agreements */}
      <div className="form-group">
        <label htmlFor="agreements">Additional Agreements:</label>
        <textarea
          id="agreements"
          name="agreements"
          rows="4"
          value={agreements}
          onChange={(e) => setAgreements(e.target.value)}
          placeholder="Describe any additional agreements..."
        ></textarea>
        <input
          type="file"
          id="uploadAgreements"
          name="uploadAgreements"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={(e) => handleFileChange(e, setUploadAgreements)}
        />
      </div>

      {/* Legal Disputes */}
      <div className="form-group">
        <label htmlFor="legalDisputes">Legal Disputes:</label>
        <textarea
          id="legalDisputes"
          name="legalDisputes"
          rows="4"
          value={legalDisputes}
          onChange={(e) => setLegalDisputes(e.target.value)}
          placeholder="Describe any ongoing or past legal disputes..."
        ></textarea>
        <input
          type="file"
          id="uploadDisputes"
          name="uploadDisputes"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={(e) => handleFileChange(e, setUploadDisputes)}
        />
      </div>

      <button type="submit">Submit</button>

      {/* Display response message or error message */}
      {responseMessage && <p className="success-message">{responseMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default LegalInfoForm;
