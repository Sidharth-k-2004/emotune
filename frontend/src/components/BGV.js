// BackgroundVideo.js
import React from 'react';
import './BGVCSS.css'; // Import your CSS for styling

const BackgroundVideo = ({ videoSrc, children }) => {
  return (
    <div className="video-background">
      <video autoPlay loop muted>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        {children} {/* Render children components on top of the video */}
      </div>
    </div>
  );
};

export default BackgroundVideo;
