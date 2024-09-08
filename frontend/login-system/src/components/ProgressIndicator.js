import React from 'react';
import './styles/ProgressIndicator.css';

const ProgressIndicator = ({ currentStep }) => {
  return (
    <div className="progress-container">
      <div className={`progress-step ${currentStep >= 1 ? 'completed' : ''}`}></div>
      <div className={`progress-step ${currentStep >= 2 ? 'completed' : ''}`}></div>
      <div className={`progress-step ${currentStep >= 3 ? 'completed' : ''}`}></div>
      <div className={`progress-step ${currentStep >= 4 ? 'completed' : ''}`}></div>
    </div>
  );
};

export default ProgressIndicator;
