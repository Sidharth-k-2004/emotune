// src/components/Player.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    text-align: center;
`;

const Player = ({ currentSong, isPlaying, onPlayPause, onNext }) => {
    return (
        <Container>
            {currentSong ? (
                <>
                    <h2>{currentSong.title}</h2>
                    <h3>{currentSong.artist}</h3>
                    <audio controls autoPlay={isPlaying}>
                        <source src={currentSong.url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <div>
                        <button onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
                        <button onClick={onNext}>Next</button>
                    </div>
                </>
            ) : (
                <p>Select a song to play</p>
            )}
        </Container>
    );
};

export default Player;
