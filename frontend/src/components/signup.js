import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import videoSrc from './spotify_bgv.mp4'; // Adjust path if needed
import BackgroundVideo from './BGV';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false); // Control visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Show the sign-up container after 2 seconds
    const timer = setTimeout(() => setShowSignup(true), 2000);
    return () => clearTimeout(timer); // Cleanup
  }, []);

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://192.168.1.7:5000/signup', { username, password });
      alert(response.data.message);
  
      // Extract userId from response
      const { userId } = response.data;
  
      // Redirect to the main page, passing userId
      navigate('/main', { state: { userId } });
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred during signup.";
      alert(errorMessage);
    }
  };

  return (
    <BackgroundVideo videoSrc={videoSrc}>
      <div className="signup-container" style={{ opacity: showSignup ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
        <h2>Sign Up</h2>
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
        <button onClick={handleSignup}>Sign Up</button>
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </BackgroundVideo>
  );
};

export default Signup;
