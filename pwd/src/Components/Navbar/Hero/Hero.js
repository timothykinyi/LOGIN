import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [showIframe, setShowIframe] = useState(false); // State to control iframe visibility
  const [receivedData, setReceivedData] = useState(null); // State to store received data

  useEffect(() => {
    const handleMessage = (event) => {
      // Make sure to check the origin without the path
      if (event.origin === 'https://own-my-data.web.app') {
        if (event.data.loggedIn) {
          setReceivedData(event.data);
          alert('Logged in successfully! Data received: ' + JSON.stringify(event.data.data)); 
          // Redirect or navigate to the dashboard after successful login
          window.location.href = 'https://globalmethodistchurches.org/business-directory/victorious-gospel/'; // Update the URL accordingly
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleExploreMoreClick = () => {
    setShowIframe(true); 
  };

  return (
    <div className='herocontainer'>
      <div className='maindiv'>
        <div className="hero-text">
          <h1>Ensuring quality care for everyone</h1>
          <p>
            Empowering Abilities, Breaking Barriers – Welcome to Ability Allies, your ultimate platform designed to inspire and uplift persons with disabilities (PWD).
            Discover a world of opportunities, resources, and community support tailored just for you.
            Whether you’re seeking accessible services, educational tools, employment guidance, 
            or a vibrant network of like-minded individuals, we are here to ensure that every ability shines.
            Together, let’s build a more inclusive, accessible, and empowered future!
          </p>
          <button className='btn' onClick={handleExploreMoreClick}>
            Explore More
          </button>
        </div>

        {showIframe && (
          <div className='leftdiv'>
            <iframe
              src={`https://own-my-data.web.app/embedlogin?cid=852966&url=${window.location.href}`}
              width="300px"
              height="500"
              style={{
                border: 'none',
                bottom: '20px',
                right: '20px',
                overflowY: 'scroll',
                zIndex: 1000,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                maxWidth: '400px',
                minHeight: '400px',
              }}
              title="Login Iframe"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
