import React, { useState } from "react";
import { Drawer, Tabs, Tab, IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";
import PlaylistTab from "./Tabs/PlaylistTab";
import ArtistInfoTab from "./Tabs/ArtistInfoTab"; 
import RecentlyPlayedTab from "./Tabs/RecentlyPlayedTab"; 
 
const MusicListDrawer = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

   const handleTabSwitch = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 350,
          backgroundColor: "#121212",
          color: "white",
        },
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
            variant="scrollable" // Kích hoạt cuộn ngang
            scrollButtons="auto" // Hiển thị các nút cuộn nếu cần
            allowScrollButtonsMobile // Cho phép nút cuộn trên thiết bị di động
          >
            <Tab label="Playlist" />
            <Tab label="Artist information" />
            <Tab label="Listen recently" />
          </Tabs>
          <IconButton onClick={onClose} style={{ color: "white" }}>
            <MdClose />
          </IconButton>
        </div>
        <div className="flex-grow overflow-y-auto">
          {activeTab === 0 && <PlaylistTab />}
          {activeTab === 1 && <ArtistInfoTab onTabChange={handleTabSwitch} />}
          {activeTab === 2 && <RecentlyPlayedTab />}
        </div>
      </div>
    </Drawer>
  );
};

export default MusicListDrawer;
