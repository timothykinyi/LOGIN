import axios from 'axios'; // Import axios for sending data
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/FinancialForm.css';

const FinancialForm = () => {
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');
  useEffect(() => {
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token)
      {
        navigate('/');
        return;
      }
    },[navigate]);
  const [financialEntries, setFinancialEntries] = useState([
    { eID: eID, id: Date.now(), bankAccountNumber: '', bankName: '', income: '', creditScore: '', taxId: '', mobileNumber: '' }
  ]);
  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState(''); // For displaying response

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setFinancialEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, [name]: value } : entry
      )
    );
  };

  const handleAddEntry = () => {
    setFinancialEntries([...financialEntries, { id: Date.now(), bankAccountNumber: '', bankName: '', income: '', creditScore: '', taxId: '', mobileNumber: '' }]);
  };

  const handleRemoveEntry = (id) => {
    setFinancialEntries(financialEntries.filter(entry => entry.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    financialEntries.forEach(entry => {
      if (!entry.bankAccountNumber) newErrors[`bankAccountNumber${entry.id}`] = 'Bank account number is required';
      if (!entry.bankName) newErrors[`bankName${entry.id}`] = 'Bank name is required';
      if (!entry.income) newErrors[`income${entry.id}`] = 'Income is required';
      if (!entry.creditScore) newErrors[`creditScore${entry.id}`] = 'Credit score is required';
      if (!entry.taxId) newErrors[`taxId${entry.id}`] = 'Tax ID is required';
      if (!entry.mobileNumber) newErrors[`mobileNumber${entry.id}`] = 'Mobile number is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedEntries = financialEntries.map(entry => ({
        ...entry,
      }));

      try {
        // Replace the URL with your backend endpoint
      
        const response = await axios.post('https://login-9ebe.onrender.com/api/financial', updatedEntries);
        setResponseMessage(`Success: ${response.data.message}`);
      } catch (error) {
        setResponseMessage(`Error: ${error.response ? error.response.data.message : 'Something went wrong'}`);
      }
    }
  };

  return (
    <form className="financial-form" onSubmit={handleSubmit}>
      <h2>Financial Information</h2>

      {financialEntries.map((entry) => (
        <div key={entry.id} className="financial-entry">
          <h3>Financial Entry {financialEntries.indexOf(entry) + 1}</h3>

          <div className="form-group">
            <label>Bank Account Number:</label>
            <input
              type="password"
              name="bankAccountNumber"
              value={entry.bankAccountNumber}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`bankAccountNumber${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`bankAccountNumber${entry.id}`] && <small className="error-message">{errors[`bankAccountNumber${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>Bank Name:</label>
            <input
              type="text"
              name="bankName"
              value={entry.bankName}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`bankName${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`bankName${entry.id}`] && <small className="error-message">{errors[`bankName${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>Income:</label>
            <input
              type="number"
              name="income"
              value={entry.income}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`income${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`income${entry.id}`] && <small className="error-message">{errors[`income${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>Credit Score:</label>
            <input
              type="number"
              name="creditScore"
              value={entry.creditScore}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`creditScore${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`creditScore${entry.id}`] && <small className="error-message">{errors[`creditScore${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>Tax ID:</label>
            <input
              type="text"
              name="taxId"
              value={entry.taxId}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`taxId${entry.id}`] ? 'error' : ''}
              required
            />
            {errors[`taxId${entry.id}`] && <small className="error-message">{errors[`taxId${entry.id}`]}</small>}
          </div>

          <div className="form-group">
            <label>Mobile Number (e.g., for M-Pesa):</label>
            <input
              type="tel"
              name="mobileNumber"
              value={entry.mobileNumber}
              onChange={(e) => handleChange(entry.id, e)}
              className={errors[`mobileNumber${entry.id}`] ? 'error' : ''}
              pattern="[0-9]{10}"
              required
            />
            {errors[`mobileNumber${entry.id}`] && <small className="error-message">{errors[`mobileNumber${entry.id}`]}</small>}
          </div>

          <button type="button" onClick={() => handleRemoveEntry(entry.id)} className="remove-entry">
            Remove This Entry
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddEntry} className="add-entry">
        Add Another Financial Entry
      </button>

      <button type="submit">Submit</button>

      {responseMessage && <div className="response-message">{responseMessage}</div>}
    </form>
  );
};

export default FinancialForm;
