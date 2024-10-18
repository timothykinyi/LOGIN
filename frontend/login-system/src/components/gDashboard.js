import React from 'react';
import DisplayContact from './displaycontact';
import DisplayEducation from './displayeducation';
import DisplayEmployment from './displayemployment';
import DisplayFinancial from './displayfinaces';
import DisplayHealth from './displayhealth';
import DisplayPersonalInfo from './displaypersonaldata';
import DisplayPreferencesAndLifestyle from './displaypreference';
import DisplaySocialAndFamily from './displaysocialFamily';

const gDashboard = () => {
  return (
    <div className="g-dashboard">
      <h1>Dashboard</h1>
      <DisplayPersonalInfo />
      <DisplayPreferencesAndLifestyle />
      <DisplaySocialAndFamily />
      <DisplayEducation />
      <DisplayEmployment />
      <DisplayFinancial />
      <DisplayHealth />
      <DisplayContact />
    </div>
  );
};

export default gDashboard;
