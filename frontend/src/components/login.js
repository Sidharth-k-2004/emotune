import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './login.css';
import videoSrc from './spotify_bgv.mp4'; // Adjust the path if needed
import BackgroundVideo from './BGV';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false); // State to control visibility
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Set a timer to show the login container after 2 seconds
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 2000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.7:5000/login', { username, password });
      alert(response.data.message);

      // Assuming your response contains the userId
      const userId = response.data.userId; // Extract userId from response

      // Redirect to the main page after a successful login
      navigate('/webcam', { state: { userId } }); // Pass userId to the main page
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred. Please try again.'); // Handle error gracefully
    }
  };

  return (
    <BackgroundVideo videoSrc={videoSrc}>
      <div className="login-container" style={{ opacity: showLogin ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </BackgroundVideo>
  );
};

export default Login;
