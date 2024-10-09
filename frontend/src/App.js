// import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Import Axios

// const SpotifyPlayer = () => {
//   const [tracks, setTracks] = useState([]); // State to hold the track URLs

//   useEffect(() => {
//     const fetchTracks = async () => {
//       try {
//         // Use Axios to fetch data from the backend
//         const response = await axios.post('http://localhost:5000/get_songs', {
//           languages: ['tamil'],
//           artists: ['sid sriram'],
//           emotion: 'happy'
//       }); // Adjust endpoint as needed
//         setTracks(response.data); // Set the track URLs received from the backend
//       } catch (error) {
//         console.error('Error fetching tracks:', error);
//       }
//     };

//     fetchTracks();
//   }, []); // Empty dependency array to run once when the component mounts

//   return (
//     <div style={{ textAlign: 'center', marginTop: '20px' }}>
//       <h2>Play Your Favorite Songs</h2>
//       {tracks.length > 0 ? (
//         tracks.map((track, index) => (
//           <div key={index} style={{ marginTop: '20px' }}>
//             <iframe
//               style={{ borderRadius: '12px' }}
//               src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator`} // Assuming track.id holds the Spotify track ID
//               width="300"
//               height="380"
//               frameBorder="0"
//               allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//             ></iframe>
//           </div>
//         ))
//       ) : (
//         <p>Loading tracks...</p>
//       )}
//     </div>
//   );
// };

// export default SpotifyPlayer;
// App.jsimport React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Main from './components/main';
import WebcamCapture from './components/webcam';
import MainPage from './components/MainPage';
import { useEffect,useState } from 'react';

function App() {
  const [songs, setSongs] = useState([]);

  // Log the value of songs whenever it changes
  useEffect(() => {
    console.log('Songs updated:', songs);
  }, [songs]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={<Main />} />
          <Route path="/webcam" element={<WebcamCapture setSongs={setSongs} />} /> {/* Pass setSongs correctly */}
          <Route path="/emotune" element={<MainPage newSongs={songs} />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;




  
