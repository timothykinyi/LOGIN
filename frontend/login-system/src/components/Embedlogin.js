import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './styles/landingPage.css';
import './styles/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoverpassword, setRecoverPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState('');
  const [url, seturl] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract the cid and url from URL on component mount
  useEffect(() => {
    const companyId = searchParams.get('cid');
    const originurl = searchParams.get('url');
    if (companyId) {
      setCid(companyId);
    }
    if (originurl) {
      seturl(originurl);
    }
  }, [searchParams]);

  // Check if user is already logged in
  useEffect(() => {
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
    if (eID && token) {
      window.parent.postMessage({ loggedIn: true }, 'https://own-my-data.web.app');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('https://login-9ebe.onrender.com/api/auth/complogin', { 
        username, 
        password, 
        cid // Send the cid to the backend
      });

      setMessage(response.data.message);
      sessionStorage.setItem('userToken', response.data.token);
      sessionStorage.setItem('eID', response.data.eID);
      sessionStorage.setItem('data', JSON.stringify(response.data.userSpecificData));
      localStorage.setItem('data', JSON.stringify(response.data.userSpecificData));
      localStorage.setItem('eID', response.data.eID);
      localStorage.setItem('userToken', response.data.token);

      const datasent = response.data.userSpecificData;
      setLoading(false);

      // Ensure the correct URL (use window.location.origin as the default)
      window.parent.postMessage({ loggedIn: true, data: datasent }, url || window.location.origin);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while processing your request.');
      }
    }
  };

  const handleRecoverPassword = () => {
    setRecoverPassword(!recoverpassword);
  };

  const sendRecovEmail = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://login-9ebe.onrender.com/api/auth/recoverpassword', { username });
      setMessage(response.data.message);
      navigate('/reset-password');
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while processing your request.');
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={recoverpassword ? sendRecovEmail : handleSubmit}>
        {!recoverpassword ? (
          <div>
            <h2>Login</h2>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password:</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="button-group">
              <button className="sign-in-btn" type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </button>
              <button className="sign-in-btn" type="button" onClick={handleRecoverPassword}>
                Forgot Password
              </button>
            </div>

            <p style={{ color: 'white' }}>
              Verify your account <Link to="/embedVerification">Verify Account</Link>
            </p>
            <p style={{ color: 'white' }}>
              If you don't have an account{' '}
              <a
                href="https://own-my-data.web.app/register"
                target="_blank"
                rel="noopener noreferrer"
              >
                Register
              </a>
            </p>
          </div>
        ) : (
          <div>
            <h2>Recover password</h2>
            <label>Enter your username:</label>
            <input
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className="button-group">
              <button type="submit" className="sign-in-btn">
                Recover password
              </button>
              <button type="button" className="sign-in-btn" onClick={handleRecoverPassword}>
                Back
              </button>
            </div>
          </div>
        )}
      </form>
      <div className="divmess">
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
