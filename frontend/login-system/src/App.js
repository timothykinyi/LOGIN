import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ContactForm from './components/ContactForm';
import Dashboard from './components/Dashboard';
import EducationForm from './components/EducationForm';
import EmbedVerification from './components/EmbedVerification';
import Embedlogin from './components/Embedlogin';
import EmploymentForm from './components/EmploymentForm';
import FetchSharedDataPage from './components/FetchSharedDataPage';
import FinancialForm from './components/FinancialForm';
import HealthForm from './components/HealthForm';
import LoginForm from './components/Login';
import Notifications from './components/Notifications';
import OfflinePage from './components/OfflinePage';
import PersonalInfoForm from './components/PersonalInfoForm';
import PreferencesAndLifestyleForm from './components/PreferencesAndLifestyleForm';
import ProfileForm from './components/ProfileForm';
import RegisterForm from './components/RegisterForm';
import SocialAndFamilyForm from './components/SocialAndFamilyForm';
import Success from './components/Success';
import Verification from './components/Verification';
import Biometrics from './components/biometrics';
import CompanyVerification from './components/companyVerification';
import Companyreg from './components/companyreg';
import Compdash from './components/compdash';
import DDashboard from './components/dDashboard';
import Displaycontact from './components/displaycontact';
import Displayeducation from './components/displayeducation';
import Displayemployment from './components/displayemployment';
import Displayfinaces from './components/displayfinaces';
import Displayhealth from './components/displayhealth';

import CompLogin from './components/compLogin';
import Comppasswordreset from './components/comppasswordreset';
import Displaypersonaldata from './components/displaypersonaldata';
import Displaypreference from './components/displaypreference';
import DisplaysocialFamily from './components/displaysocialFamily';
import DD from './components/door/DoorDash';
import DoorManagement from './components/door/DoorManagement';
import HomePage from './components/door/HomePage';
import HousePage from './components/door/HousePage';
import HouseRegistration from './components/door/HouseRegistration';
import Doormanagment from './components/door/doormanagment';
import Phonedoor from './components/door/phonedoor';
import UserDoorDash from './components/door/userdoormanagmentsystemdash';
import GDashboard from './components/gDashboard';
import Homedash from './components/house/homedash';
import HouseVerification from './components/house/houseVerification';
import Housedash from './components/house/housedash';
import Housereg from './components/house/housereg';
import Landing from './components/landing';
import Mw from './components/m';
import Passwordrecovery from './components/passwordreset';
import Settings from './components/settings';
import useOnlineStatus from './hooks/useOnlineStatus'; // Import the hook
import { urlBase64ToUint8Array } from './utils';

const publicVapidKey = 'BHy-iFuUVJcGUNDPMC4LbU4-XF__xh_60-zl5c8nS4eOwY5bfcxjEmGBZ4JIfzwcDkuq7IttOv0_YRKo9qm_On8';

function App() {
  useEffect(() => {
    // Register service worker and subscribe to push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(function (registration) {
        console.log('Service Worker registered with scope:', registration.scope);

        return Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {
            subscribeUserToPush(registration);
          }
        });
      });
    }
  }, []);

  const eID = localStorage.getItem('eID');
  const userId = eID;  // Replace this with the real user ID from your auth system

  const subscribeUserToPush = async (registration) => {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      console.log('User is subscribed:', subscription);

      // Send subscription and user ID to your server
      await fetch('https://login-9ebe.onrender.com/api/subs/subscribe', {
        method: 'POST',
        body: JSON.stringify({ userId, subscription }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to subscribe the user:', error);
    }
  };

  return (
    <Router>
      <OnlineStatusChecker /> {/* This component will handle online status */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/embedlogin" element={<Embedlogin />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/embedVerification" element={<EmbedVerification />} />
        <Route path="/reset-password" element={<Passwordrecovery />} />
        <Route path="/compreset-password" element={<Comppasswordreset />} />
        <Route path="/success" element={<Success />} />
        <Route path="/compLogin" element={<CompLogin />} />
        <Route path="/compdash" element={<Compdash />} />
        <Route path="/profileForm" element={<ProfileForm />} />
        <Route path="/gDashboard/personalinfoForm" element={<PersonalInfoForm />} />
        <Route path="/gDashboard/educationForm" element={<EducationForm />} />
        <Route path="/gDashboard/contactForm" element={<ContactForm />} />
        <Route path="/gDashboard/healthForm" element={<HealthForm />} />
        <Route path="/gDashboard/employmentForm" element={<EmploymentForm />} />
        <Route path="/gDashboard/financialForm" element={<FinancialForm />} />
        <Route path="/gDashboard/socialAndFamilyForm" element={<SocialAndFamilyForm />} />
        <Route path="/gDashboard/preferencesAndLifestyleForm" element={<PreferencesAndLifestyleForm />} />
        <Route path="/gDashboard" element={<GDashboard />} />
        <Route path="/dDashboard" element={<DDashboard />} />
        <Route path="/companyVerification" element={<CompanyVerification />} />
        <Route path="/showcontact" element={<Displaycontact />} />
        <Route path="/dDashboard/displayeducation" element={<Displayeducation />} />
        <Route path="/dDashboard/displayemployment" element={<Displayemployment />} />
        <Route path="/dDashboard/displayfinaces" element={<Displayfinaces />} />
        <Route path="/dDashboard/displayhealth" element={<Displayhealth />} />
        <Route path="/dDashboard/displaypreference" element={<Displaypreference />} />
        <Route path="/dDashboard/displaysocialFamily" element={<DisplaysocialFamily />} />
        <Route path="/dDashboard/displaypersonaldata" element={<Displaypersonaldata />} />
        <Route path="/biometrics" element={<Biometrics />} />
        <Route path="/userDoorDash" element={<UserDoorDash />} />
        <Route path="/doordash" element={<DD />} />
        <Route path="/companyreg" element={<Companyreg />} />
        <Route path="/offline" element={<OfflinePage />} />
        <Route path="/doorManagement" element={<DoorManagement />} />
        <Route path="/houseRegistration" element={<HouseRegistration />} />
        <Route path="/userDoorDash/doormanagment" element={<Doormanagment />} /> 
        <Route path="/userDoorDash/phonedoor" element={<Phonedoor />} />
        <Route path="/m" element={<Mw />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/house" element={<HomePage />} />
        <Route path="/house/:houseId" element={<HousePage />} />
        <Route path="/sharedlink/:eID" element={<FetchSharedDataPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/house/housereg" element={<Housereg />} />
        <Route path="/house/verification" element={<HouseVerification />} />
        <Route path="/house/housedash" element={<Housedash />} />
        <Route path="/house/homedash" element={<Homedash />} />
        
      </Routes>
    </Router>
  );
}

// New component to handle online/offline status
function OnlineStatusChecker() {
  const isOnline = useOnlineStatus();  // This now runs within the Router context

  return null;  // No need to render anything
}

export default App;
