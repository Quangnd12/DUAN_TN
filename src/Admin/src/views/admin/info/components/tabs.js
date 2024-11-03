import React from 'react';
import { Tabs, Tab } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";

const ProfileTabs = ({ activeTab, handleTabChange }) => (
  <Tabs
    value={activeTab}
    onChange={handleTabChange}
    aria-label="profile tabs"
  >
    <Tab icon={<MusicNoteIcon />} label="About" />
    <Tab icon={<QueueMusicIcon />} label="Playlists" />
    <Tab icon={<FavoriteIcon />} label="Favorites" />
    <Tab icon={<HistoryIcon />} label="History" />
  </Tabs>
);

export default ProfileTabs;
