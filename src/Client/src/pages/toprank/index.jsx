import React, { useState, useEffect } from "react";
// import ToprankList from "./sections/toprank";
// import ToprankInfo from "./components/ToprankInfo";
import RowToprank from "../../components/row_toprank/Rowtoprank";

const AllToprank = () => {
  const [globalPlayingState, setGlobalPlayingState] = useState(() => {
    const savedState = localStorage.getItem("globalPlayingState");
    return savedState ? JSON.parse(savedState) : { rowId: null, index: null };
  });
  useEffect(() => {
    localStorage.setItem(
      "globalPlayingState",
      JSON.stringify(globalPlayingState)
    );
  }, [globalPlayingState]);
  return (

    <div className="relative bg-zinc-900 w-full h-screen">
      <RowToprank
        title={"Popular albums"}
        data={data.toprank}
        rowId="popular-albums"
        globalPlayingState={globalPlayingState}
        setGlobalPlayingState={setGlobalPlayingState}
      />
    </div>
  );
};

export default AllToprank;
