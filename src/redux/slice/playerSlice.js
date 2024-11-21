import { createSlice } from '@reduxjs/toolkit';

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    currentTrack: null,
    isPlaying: false,
    playlist: [],
    currentIndex: 0
  },
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
      state.currentIndex = 0;
      state.currentTrack = state.playlist[0] || null;
    },
    nextTrack: (state) => {
      if (state.playlist.length === 0) return;
      
      state.currentIndex = (state.currentIndex + 1) % state.playlist.length;
      state.currentTrack = state.playlist[state.currentIndex];
      state.isPlaying = true;
    },
    prevTrack: (state) => {
      if (state.playlist.length === 0) return;
      
      state.currentIndex = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length;
      state.currentTrack = state.playlist[state.currentIndex];
      state.isPlaying = true;
    },
    removeFromPlaylist: (state, action) => {
      const songIdToRemove = action.payload;
      const newPlaylist = state.playlist.filter(song => song.id !== songIdToRemove);
      
      state.playlist = newPlaylist;
      
      // Adjust current index if needed
      if (state.currentIndex >= newPlaylist.length) {
        state.currentIndex = 0;
      }
      
      state.currentTrack = newPlaylist[state.currentIndex] || null;
    },
    addToPlaylist: (state, action) => {
      const songToAdd = action.payload;
      
      // Prevent duplicate songs
      const isDuplicate = state.playlist.some(song => song.id === songToAdd.id);
      if (!isDuplicate) {
        state.playlist.push(songToAdd);
      }
    }
  }
});

export const { 
  setCurrentTrack, 
  togglePlay, 
  setPlaylist, 
  nextTrack, 
  prevTrack,
  removeFromPlaylist,
  addToPlaylist
} = playerSlice.actions;

export default playerSlice.reducer;