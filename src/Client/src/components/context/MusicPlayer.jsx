import React, { createContext, useState, useEffect } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [playerState, setPlayerState] = useState({
    audioUrl: null,
    title: null,
    artist: null,
    Image: null,
    lyrics: null,
    album: null,
    playCount: null,
    TotalDuration:null,
    songId:null,
    is_premium:null
  });

  const [Songs, setSongs] = useState([]);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const savedState = localStorage.getItem("playerState");
    if (savedState) {
      setPlayerState(JSON.parse(savedState));
    }

    const savedSongs = localStorage.getItem("songs");
    if (savedSongs) {
      setSongs(JSON.parse(savedSongs));
    }

    const savedClickedIndex = localStorage.getItem("clickedIndex");
    if (savedClickedIndex !== null) {
      setClickedIndex(parseInt(savedClickedIndex, 10));
    }
  }, []);

  useEffect(() => {
    if (playerState.audioUrl) {
      localStorage.setItem("playerState", JSON.stringify(playerState));
    }
  }, [playerState]);

  useEffect(() => {
    if (Songs.length > 0) {
      localStorage.setItem("songs", JSON.stringify(Songs));
    }
  }, [Songs]);

  useEffect(() => {
    if (clickedIndex !== null) {
      localStorage.setItem("clickedIndex", clickedIndex);
    }
  }, [clickedIndex]);

  return (
    <PlayerContext.Provider value={{ playerState, setPlayerState, Songs, setSongs, clickedIndex, setClickedIndex, isPlaying, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
};
