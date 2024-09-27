import React from "react";
import TopChartList from "../components/TopChart";
// import AlbumRandom from "../components/RelateAlbum";

const  TopChart= () => {
  return (
    <div className="p-4  bg-gradient-to-t rounded-b-lg mt-4 backdrop-filter">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <TopChartList/>
        {/* <AlbumRandom /> */}
      </div>
    </div>
  );
};

export default TopChart;
