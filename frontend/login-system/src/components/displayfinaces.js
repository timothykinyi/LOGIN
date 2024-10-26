import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/displayfinaces.css';

const FinancialDataList = () => {
  const [financialData, setFinancialData] = useState([]);
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');

    if (!eID || !token) {
      navigate('/');
      return;
    }

    // Fetch financial data when the component mounts
    axios.get(`https://login-9ebe.onrender.com/api/financial/all?eID=${eID}`)
      .then(response => {
        setFinancialData(response.data.data); // Directly set the financial data returned from backend
      })
      .catch(error => {
        console.error('Error fetching financial data:', error);
      });
  }, [navigate, eID]);

  return (
    <div className="fin-container">
      <h2>Financial Data</h2>
      <ul className="fin-list">
        {financialData.map((financial, index) => (
          <li className="fin-item" key={index}>
            <p><strong>Bank Account Number:</strong> {financial.bankAccountNumber}</p>
            <p><strong>Bank Name:</strong> {financial.bankName}</p>
            <p><strong>Income:</strong> {financial.income}</p>
            <p><strong>Credit Score:</strong> {financial.creditScore}</p>
            <p><strong>Tax ID:</strong> {financial.taxId}</p>
            <p><strong>Mobile Number:</strong> {financial.mobileNumber}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialDataList;
