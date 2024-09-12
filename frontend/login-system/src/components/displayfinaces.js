import axios from 'axios';
import React, { useEffect, useState } from 'react';

const FinancialDataList = () => {
  const [financialData, setFinancialData] = useState([]);

  useEffect(() => {
    // Fetch financial data when the component mounts
    axios.get('https://login-9ebe.onrender.com/api/financial/all')  // Replace with your actual backend URL
      .then(response => {
        setFinancialData(response.data.data); // Set the fetched data to state
      })
      .catch(error => {
        console.error('Error fetching financial data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Financial Data</h2>
      <ul>
        {financialData.map((financial, index) => (
          <li key={index}>
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
