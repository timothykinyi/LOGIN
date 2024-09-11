import React, { useState } from 'react';
import './styles/LegalInfoForm.css'; // Ensure to import the CSS file

const LegalInfoForm = () => {
  // State management
  const [criminalRecord, setCriminalRecord] = useState('');
  const [contracts, setContracts] = useState('');
  const [agreements, setAgreements] = useState('');
  const [legalDisputes, setLegalDisputes] = useState('');
  const [uploadRecords, setUploadRecords] = useState(null);
  const [uploadContracts, setUploadContracts] = useState(null);
  const [uploadAgreements, setUploadAgreements] = useState(null);
  const [uploadDisputes, setUploadDisputes] = useState(null);
  
  // File input handler
  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here
    console.log('Criminal Record:', criminalRecord);
    console.log('Contracts and Agreements:', contracts);
    console.log('Additional Agreements:', agreements);
    console.log('Legal Disputes:', legalDisputes);
    console.log('Uploaded Criminal Record:', uploadRecords);
    console.log('Uploaded Contracts:', uploadContracts);
    console.log('Uploaded Additional Agreements:', uploadAgreements);
    console.log('Uploaded Legal Disputes:', uploadDisputes);
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

      {/* Additional Information */}
      <div className="form-group">
        <label htmlFor="additionalInfo">Additional Legal Information:</label>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          rows="4"
          placeholder="Provide any other relevant legal information..."
        ></textarea>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default LegalInfoForm;
