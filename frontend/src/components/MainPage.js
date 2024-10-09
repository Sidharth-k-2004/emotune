
// import React, { useState,useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './MainPage.css'; 
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios'; 
// import { useParams } from 'react-router-dom';


// function MainPage(newSongs) {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [songs, setSongs] = useState(newSongs || []); 
//     const { songId } = useParams();
//     console.log(songs);
//     useEffect(() => {
//         setSongs(newSongs);
//       });
//     const handleSearch = async () => {
//         try {
//             const response = await axios.post('http://192.168.91.228:5000/search', {
//                 query: searchTerm
//             });
            
//             setSongs(response.data); 
//         } catch (error) {
//             console.error("Error fetching songs:", error);
//         }
//     };

//     const handleKeyPress = (event) => {
//         if (event.key === 'Enter') {
//             handleSearch(); 
//         }
//     };

//     return (
//         <div style={{
//             backgroundImage: `url('/Images/bg_sp.jpg')`,  // Changed to template literal
//             backgroundSize: 'cover',
//             backgroundAttachment: 'scroll',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//             backgroundAttachment: 'fixed',
//             minHeight: '100vh',
//             width: '100%',
//             color: 'white',
//         }}>
//             <div className="row" style={{ padding: '20px' }}>
//                 <div className='col-2' style={{ marginLeft: "120px" }}>
//                     <img
//                         src="/Images/logo_sp.jpg"
//                         alt="App Logo"
//                         style={{ width: '100px', height: '100px' }}
//                     />
//                 </div>
//                 <div className="col-5 text-center mt-4">
//                     <input
//                         type="text"
//                         className="form-control search-input"
//                         placeholder="Search for a song..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         onKeyPress={handleKeyPress} 
//                         style={{
//                             backgroundColor: 'rgba(68, 68, 68, 0.8)',
//                             color: 'white',
//                             width: '400px',
//                             margin: '0 auto',
//                             borderRadius: '40px',
//                             border: 'none' 
//                         }}
//                     />
//                 </div>
//                 <div className='col-3 mt-4'>
//                     <button
//                         style={{
//                             backgroundColor: 'green',
//                             borderRadius: '50%',
//                             width: '50px',
//                             height: '50px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             border: 'none',
//                             cursor: 'pointer',
//                             boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//                         }}
//                     >
//                         <FontAwesomeIcon icon={faUser} size="lg" color="white" />
//                     </button>
//                 </div>
//             </div>
//             <div className="row p-5 mx-5" style={{ flexGrow: 1, justifyContent:"space-around", display:"flex" }}>
//                 {songs.map((song, index) => (
//                     <div className="col-md-3 col-sm-6 mb-1" key={index} style={{ justifyContent:"space-around" }}> 
//                         <iframe
//                             style={{ borderRadius: '12px', width: '100%' }} 
//                             src={`https://open.spotify.com/embed/track/${song.id}?utm_source=generator`}
//                             height="350"
//                             frameBorder="0"
//                             allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//                         ></iframe>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default MainPage;


import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; 
import { useParams } from 'react-router-dom';

function MainPage({ newSongs }) {  // Destructure newSongs from props
    const [searchTerm, setSearchTerm] = useState('');
    const [songs, setSongs] = useState(newSongs || []); 
    const { songId } = useParams();

    useEffect(() => {
        setSongs(newSongs);
    }, [newSongs]);

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://192.168.1.7:5000/search', {
                query: searchTerm
            });
            
            setSongs(response.data);  // Assuming response contains new song URLs
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch(); 
        }
    };

    return (
        <div style={{
            backgroundImage: `url('/Images/bg_sp.jpg')`,  
            backgroundSize: 'cover',
            backgroundAttachment: 'scroll',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            width: '100%',
            color: 'white',
        }}>
            <div className="row" style={{ padding: '20px' }}>
                <div className='col-2' style={{ marginLeft: "120px" }}>
                    <img
                        src="/Images/logo_sp.jpg"
                        alt="App Logo"
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>
                <div className="col-5 text-center mt-4">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search for a song..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress} 
                        style={{
                            backgroundColor: 'rgba(68, 68, 68, 0.8)',
                            color: 'white',
                            width: '400px',
                            margin: '0 auto',
                            borderRadius: '40px',
                            border: 'none' 
                        }}
                    />
                </div>
                <div className='col-3 mt-4'>
                    <button
                        style={{
                            backgroundColor: 'green',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        }}
                    >
                        <FontAwesomeIcon icon={faUser} size="lg" color="white" />
                    </button>
                </div>
            </div>

            <div className="row p-5 mx-5" style={{ flexGrow: 1, justifyContent:"space-around", display:"flex" }}>
                {songs.length > 0 ? (
                    songs.map((song, index) => (
                        <div className="col-md-3 col-sm-6 mb-1" key={index} style={{ justifyContent:"space-around" }}> 
                            <iframe
                                style={{ borderRadius: '12px', width: '100%' }} 
                                // src={`${songUrl}`}  
                                src={`https://open.spotify.com/embed/track/${song.id}?utm_source=generator`}
                                height="350"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            ></iframe>
                        </div>
                    ))
                ) : (
                    <p>No songs to display.</p>
                )}
            </div>
        </div>
    );
}

export default MainPage;
