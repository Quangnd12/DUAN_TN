// PlayerContext.js
import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false); // Trạng thái hiển thị thanh nhạc

  return (
    <PlayerContext.Provider value={{ selectedPlayer, setSelectedPlayer, isPlayerVisible, setIsPlayerVisible }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};
