// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Import Axios
// import {sendRequest} from '../api/sendRequest'
// const WebcamCapture = ({serSongs}) => {
//   const navigate = useNavigate(); // Initialize navigate function
//   const videoRef = useRef(null); // Ref for the video element
//   const canvasRef = useRef(null); // Ref for the canvas element
//   const [songs, setSongs] = useState([]); 

//   useEffect(() => {
//     let stream = null;

//     const captureImage = async () => {
//       try {
//         // Access the user's webcam
//         stream = await navigator.mediaDevices.getUserMedia({ video: true });

//         // Set the video source object to the webcam stream
//         const video = videoRef.current;
//         video.srcObject = stream;

//         // Wait for the video stream to load
//         video.onloadedmetadata = () => {
//           video.play();

//           // Wait for 3 seconds and then capture the image
//           setTimeout(() => {
//             // Access the hidden canvas element
//             const canvas = canvasRef.current;
//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;

//             const context = canvas.getContext('2d');
//             context.drawImage(video, 0, 0, canvas.width, canvas.height);

//             // Get the image as a base64-encoded URL
//             const imageDataURL = canvas.toDataURL('image/png');
//             sendImageToBackend(imageDataURL);

//             // Stop the video stream after capturing the image
//             const tracks = stream.getTracks();
//             tracks.forEach(track => track.stop());
//           }, 3000); // Capture image after 3 seconds
//         };
//       } catch (err) {
//         console.error("Error accessing the webcam: ", err);
//       }
//     };

//     captureImage();

//     // Clean up function to stop the video stream if component unmounts
//     return () => {
//       if (stream) {
//         const tracks = stream.getTracks();
//         tracks.forEach(track => track.stop());
//       }
//     };
//   }, []);

//   const sendImageToBackend = async (imageDataURL) => {
//     const base64Image = imageDataURL.split(',')[1]; // Get base64 part
//     try {
//       // Send image using Axios
//       const response = await axios.post('http://10.7.19.112:5000/imageprocessing', {
//         image: base64Image,
//       });

//       // Check if the response is OK
//       if (response.status === 200) {
//         console.log('Image sent successfully!');
//         setSongs(response.data); // Assuming the response contains a 'songs' array
//         console.log(response.data)
//         sendRequest.then()(setSongs)
//         navigate('/emotune',  );
//       } else {
//         console.error('Error sending image to backend:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Network error while sending image:', error);
//     }
//   };

//   return (
//     <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
//       {/* Hidden video element that streams the webcam feed */}
//       <video ref={videoRef} style={{ display: 'none' }} />

//       {/* Hidden canvas element for capturing the image */}
//       <canvas ref={canvasRef} style={{ display: 'none' }} />

//       {/* Image preview */}
//       <div
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           width: '100vw',
//           height: '100vh',
//           backgroundColor: 'black', // Semi-transparent overlay
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           color: 'black',
//           fontSize: '24px',
//           zIndex: 1000,
//         }}
//       >
//         <video
//           src="Images/loading.mp4" // Replace with your video URL
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             marginLeft: '35%',
//             marginTop: '15%',
//             width: '30%',
//             height: '30%',
//             objectFit: 'cover',
//             zIndex: -1,
//             opacity: 0.8,
//           }}
//           autoPlay
//           loop
//           muted
//         />
//       </div>
//     </div>
//   );
// };

// export default WebcamCapture;
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const WebcamCapture = ({ setSongs }) => {
  const navigate = useNavigate(); // Initialize navigate function
  const videoRef = useRef(null); // Ref for the video element
  const canvasRef = useRef(null); // Ref for the canvas element
  console.log('setSongs prop:', setSongs);
  useEffect(() => {
    let stream = null;

    const captureImage = async () => {
      try {
        // Access the user's webcam
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Set the video source object to the webcam stream
        const video = videoRef.current;
        video.srcObject = stream;

        // Wait for the video stream to load
        video.onloadedmetadata = () => {
          video.play();

          // Wait for 3 seconds and then capture the image
          setTimeout(() => {
            // Access the hidden canvas element
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get the image as a base64-encoded URL
            const imageDataURL = canvas.toDataURL('image/png');
            sendImageToBackend(imageDataURL);

            // Stop the video stream after capturing the image
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
          }, 3000); // Capture image after 3 seconds
        };
      } catch (err) {
        console.error("Error accessing the webcam: ", err);
      }
    };

    captureImage();

    // Clean up function to stop the video stream if component unmounts
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const sendImageToBackend = async (imageDataURL) => {
    const base64Image = imageDataURL.split(',')[1]; // Extract base64 image part
    try {
      // Send the image data to the backend
      const response = await axios.post('http://192.168.1.7:5000/imageprocessing', {
        image: base64Image,
      });
  
      // Check if the response is successful
      if (response.status === 200) {
        console.log(response.data);
        console.log('Image sent successfully!');
        // const externalUrls = response.data.map(song => song.external_url);
        // setSongs(externalUrls);
        setSongs(response.data);
        
  
        // Navigate to the /emotune page
        navigate('/emotune');
      } else {
        console.error('Error sending image to backend:', response.statusText);
      }
    } catch (error) {
      console.error('Network error while sending image:', error);
    }
  };
  
     

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Hidden video element that streams the webcam feed */}
      <video ref={videoRef} style={{ display: 'none' }} />

      {/* Hidden canvas element for capturing the image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Image preview */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black', // Semi-transparent overlay
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          fontSize: '24px',
          zIndex: 1000,
        }}
      >
        <video
          src="Images/loading.mp4" // Replace with your video URL
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            marginLeft: '35%',
            marginTop: '15%',
            width: '30%',
            height: '30%',
            objectFit: 'cover',
            zIndex: -1,
            opacity: 0.8,
          }}
          autoPlay
          loop
          muted
        />
      </div>
    </div>
  );
};

export default WebcamCapture;
