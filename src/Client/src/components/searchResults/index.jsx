import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import AllResults from "./Tabs/AllResults";
import SongsResults from "./Tabs/SongsResults";
import AlbumsResults from "./Tabs/AlbumsResults";
import PlaylistsResults from "./Tabs/PlaylistsResults";
import ArtistsResults from "./Tabs/ArtistsResults";

const SearchResults = ({ results }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <>
      <div className="bg-zinc-900 space-x-4 mb-6">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          className="mb-6 text-white"
          TabIndicatorProps={{
            style: { backgroundColor: "white" },
          }}
          sx={{
            "& .MuiTab-root": {
              color: "white",
              border: "none",
              borderRadius: "5px",
              margin: "5px",
            },
            "& .Mui-selected": {
              backgroundColor: "gray",
            },
          }}
        >
          <Tab label="All" />
          <Tab label="Songs" />
          <Tab label="Albums" />
          <Tab label="Playlists" />
          <Tab label="Artists" />
        </Tabs>
        {activeTab === 0 && <AllResults results={results} />}
        {activeTab === 1 && <SongsResults songs={results.songs} />}
        {activeTab === 2 && <AlbumsResults albums={results.albums} />}
        {activeTab === 3 && <PlaylistsResults playlists={results.playlists} />}
        {activeTab === 4 && <ArtistsResults artists={results.artists} />}
      </div>
    </>
  );
};

export default SearchResults;
