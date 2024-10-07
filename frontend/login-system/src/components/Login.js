import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/button.css';
import './styles/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoverpassword, setRecoverPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      setLoading(true);
      const response = await axios.post('https://login-9ebe.onrender.com/api/auth/login', { username, password });
      setMessage(response.data.message);
      sessionStorage.setItem('userToken', response.data.token);
      sessionStorage.setItem('eID', response.data.eID);
      navigate('/dDashboard');
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
        setMessage('An error occurred while processing your request..');
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
            <input type="text" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} required/>

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
                style={{background: "none"}}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button className='button' type="submit"disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
            <button className='button' type="button" onClick={handleRecoverPassword}>Forgot Password</button>
            <p style={{color: 'white'}} >Verify your account  <Link to="/verification">Verify Account</Link></p>
            <p style={{color: 'white'}}>If you don't have an account <Link to="/register">Register</Link></p>
          </div>
        ) : (
          <div>
            <h2>Recover password</h2>
            <label>Enter your username:</label>
            <input type="text" value={username} placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} required/>
            <button type="submit" className='button' >Recover password</button>
            <button type="button" className='button' onClick={handleRecoverPassword}>Back</button>
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
