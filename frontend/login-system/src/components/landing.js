import React, { useEffect, useState } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import logo from './images/lg.png';
import './styles/landingPage.css'; // Updated CSS file

const LandingPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false); // Track if app is installed

  // Check if app is installed and listen for the install prompt
  useEffect(() => {
    const eID = localStorage.getItem('eID');
    const token = localStorage.getItem('userToken');
    // Check if the user is logged in (check for valid token and eID)
    if (eID && token) {
      // Redirect to the dashboard if already logged in
      sessionStorage.setItem('userToken', token);
      sessionStorage.setItem('eID', eID);
      navigate('/dDashboard');
      return;
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true); // If installed, set the flag to true
    }

    // Handle the install prompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default mini-infobar
      setDeferredPrompt(e); // Save the install prompt event for later
    };

    // Add event listener for the install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup event listener
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [navigate]);

  // Function to trigger the install prompt
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt to the user
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install');
        } else {
          console.log('User dismissed the install');
        }
        setDeferredPrompt(null); // Clear the saved event after user choice
      });
    }
  };

  return (
    <div className="landing-container">
      <div className="overlay">
        <div className="hero">
          <img src={logo} alt="Company Logo" className="log" />
          {/* Show install button if app is not installed, otherwise show sign-in/sign-up */}
          {!isInstalled && deferredPrompt ? (
            <div className="button-group"> 
              <button onClick={handleInstallClick} className="install-button">
                Install App
              </button>
            </div>
          ) : (
            <>
              <p className="hero-description">
                Welcome to EiD, your identity, simplified.
              </p>
              <div className="button-group">
                <button className="sign-in-btn" onClick={() => navigate('/login')}>
                  Sign In
                </button>
                <button className="sign-up-btn" onClick={() => navigate('/register')}>
                  Sign Up
                </button>
              </div>
              <div className="button-group">
                <button className="sign-in-btn" onClick={() => navigate('/compLogin')}>
                  Log Into company
                </button>
                <button className="sign-up-btn" onClick={() => navigate('/companyreg')}>
                  Sign Up for companies
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
