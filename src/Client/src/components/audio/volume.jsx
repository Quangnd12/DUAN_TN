// src/context/AudioContext.js
import React, { createContext, useContext, useState, useRef } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(null);
  const audioRef = useRef(null);

  return (
    <AudioContext.Provider value={{ audio, setAudio, audioRef }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
