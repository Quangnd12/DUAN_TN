import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../../utils/StateProvider";
import { FaVolumeUp, FaVolumeMute, FaMusic, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Volume() {
  const [{ token }] = useStateProvider();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100); // Default volume level
  const [isLyricsVisible, setIsLyricsVisible] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  const setVolumeLevel = async (volumePercent) => {
    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player/volume",
        {},
        {
          params: { volume_percent: volumePercent },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  };

  const handleVolumeChange = async (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (!isMuted) {
      await setVolumeLevel(newVolume);
    }
  };

  const toggleMute = async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (newMutedState) {
      await setVolumeLevel(0); // Mute
    } else {
      await setVolumeLevel(volume); // Unmute and restore previous volume
    }
  };

  const toggleLyrics = () => {
    setIsLyricsVisible(!isLyricsVisible);
  };

  const toggleViewMode = () => {
    setIsViewMode(!isViewMode);
  };

  return (
    <Container>
      <IconContainer>
        {isMuted ? (
          <FaVolumeMute onClick={toggleMute} />
        ) : (
          <FaVolumeUp onClick={toggleMute} />
        )}
        <input
          type="range"
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={100}
          disabled={isMuted} // Disable slider if muted
        />
        <FaMusic
          onClick={toggleLyrics}
          color={isLyricsVisible ? "lightgreen" : "white"}
          title="Lyrics"
        />
        {isViewMode ? (
          <FaEye onClick={toggleViewMode} title="Switch View Mode" />
        ) : (
          <FaEyeSlash onClick={toggleViewMode} title="Switch View Mode" />
        )}
      </IconContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Add some space between the icons and the slider */
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* Space between icons */
  
  input {
    width: 15rem;
    border-radius: 2rem;
    height: 0.5rem;
  }
  
  svg {
    color: white; /* Adjust color as needed */
    font-size: 1.5rem; /* Adjust size as needed */
    cursor: pointer; /* Make icons clickable */
  }
`;
