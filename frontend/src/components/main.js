// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import './main.css';
// import axios from 'axios';
// import videoSrc from './spotify_bgv.mp4';
// import BackgroundVideo from './BGV';

// const artists = [
//   { id: 1, name: 'Pritam' },
//   { id: 2, name: 'A.R. Rahman' },
//   { id: 3, name: 'Sachin-Jigar' },
//   { id: 4, name: 'Arijit Singh' },
//   { id: 5, name: 'Anirudh Ravichander' },
// ];

// const languages = ['Hindi', 'Kannada', 'Telugu', 'Tamil', 'Malayalam'];

// const Main = () => {
//   const location = useLocation();
//   const { userId } = location.state; // Get userId from state
//   const [selectedArtists, setSelectedArtists] = useState([]);
//   const [selectedLanguages, setSelectedLanguages] = useState([]);

//   const handleArtistSelect = (id) => {
//     setSelectedArtists((prev) =>
//       prev.includes(id) ? prev.filter((artistId) => artistId !== id) : [...prev, id]
//     );
//   };

//   const handleLanguageSelect = (language) => {
//     setSelectedLanguages((prev) =>
//       prev.includes(language) ? prev.filter((lang) => lang !== language) : [...prev, language]
//     );
//   };

//   const handleSubmit = async () => {
//     const selectedArtistNames = selectedArtists.map((id) =>
//       artists.find((artist) => artist.id === id)?.name
//     ).filter(Boolean);

//     try {
//       const response = await axios.post('http://10.7.19.112:5000/storeSelection', {
//         userId, // Pass userId to the backend
//         selectedLanguages,
//         selectedArtists: selectedArtistNames,
//       });

//       alert(response.data.message);
//     } catch (error) {
//       alert('Error storing selection: ' + error.response?.data?.error || error.message);
//     }
//   };

//   return (
//     <BackgroundVideo videoSrc={videoSrc}>
//       <div>
//         <h1>Main Page</h1>
//         <p>Welcome User ID: {userId}</p>
        
//         <h2>Select Artists:</h2>
//         <div className="artist-grid">
//           {artists.map((artist) => (
//             <button
//               key={artist.id}
//               className={`artist-button ${selectedArtists.includes(artist.id) ? 'selected' : ''}`}
//               onClick={() => handleArtistSelect(artist.id)}
//             >
//               {artist.name}
//             </button>
//           ))}
//         </div>

//         <h2>Select Languages:</h2>
//         <div className="language-grid">
//           {languages.map((language) => (
//             <button
//               key={language}
//               className={`language-button ${selectedLanguages.includes(language) ? 'selected' : ''}`}
//               onClick={() => handleLanguageSelect(language)}
//             >
//               {language}
//             </button>
//           ))}
//         </div>

//         <button className='next' onClick={handleSubmit}>Submit</button>
//       </div>
//     </BackgroundVideo>
//   );
// };

// export default Main;
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import './main.css';
import axios from 'axios';
import videoSrc from './spotify_bgv.mp4';
import BackgroundVideo from './BGV';

const artists = [
  { id: 1, name: 'Pritam' },
  { id: 2, name: 'A.R. Rahman' },
  { id: 3, name: 'Sachin-Jigar' },
  { id: 4, name: 'Arijit Singh' },
  { id: 5, name: 'Anirudh Ravichander' },
];

const languages = ['Hindi', 'Kannada', 'Telugu', 'Tamil', 'Malayalam'];

const Main = () => {
  const location = useLocation();
  const { userId } = location.state; // Get userId from state
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleArtistSelect = (id) => {
    setSelectedArtists((prev) =>
      prev.includes(id) ? prev.filter((artistId) => artistId !== id) : [...prev, id]
    );
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language) ? prev.filter((lang) => lang !== language) : [...prev, language]
    );
  };

  const handleSubmit = async () => {
    const selectedArtistNames = selectedArtists.map((id) =>
      artists.find((artist) => artist.id === id)?.name
    ).filter(Boolean);

    try {
      const response = await axios.post('http://192.168.1.7:5000/storeSelection', {
        userId, // Pass userId to the backend
        selectedLanguages,
        selectedArtists: selectedArtistNames,
      });

      alert(response.data.message);
      navigate('/webcam'); // Navigate to /webcam after successful submission
    } catch (error) {
      alert('Error storing selection: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <BackgroundVideo videoSrc={videoSrc}>
      <div>
        <h1>Main Page</h1>
        <p>Welcome User ID: {userId}</p>
        
        <h2>Select Artists:</h2>
        <div className="artist-grid">
          {artists.map((artist) => (
            <button
              key={artist.id}
              className={`artist-button ${selectedArtists.includes(artist.id) ? 'selected' : ''}`}
              onClick={() => handleArtistSelect(artist.id)}
            >
              {artist.name}
            </button>
          ))}
        </div>

        <h2>Select Languages:</h2>
        <div className="language-grid">
          {languages.map((language) => (
            <button
              key={language}
              className={`language-button ${selectedLanguages.includes(language) ? 'selected' : ''}`}
              onClick={() => handleLanguageSelect(language)}
            >
              {language}
            </button>
          ))}
        </div>

        <button className='next' onClick={handleSubmit}>Submit</button>
      </div>
    </BackgroundVideo>
  );
};

export default Main;
