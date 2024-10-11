import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Store the current page URL before going offline
    const handleOffline = () => {
      localStorage.setItem('previousPage', location.pathname); // Store the previous page in localStorage
      setIsOnline(false); 
      navigate('/offline'); // Redirect to the offline page
    };

    // Restore connection and redirect to the previous page
    const handleOnline = () => {
      setIsOnline(true);
      const previousPage = localStorage.getItem('previousPage');
      if (previousPage) {
        navigate(previousPage); // Redirect to the previous page
        localStorage.removeItem('previousPage'); // Clean up
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Cleanup event listeners when component unmounts
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [location, navigate]);

  return isOnline;
};

export default useOnlineStatus;
