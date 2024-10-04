import React from "react";
import ToprankList from "./sections/toprank";
import ToprankInfo from "./components/ToprankInfo";

const Toprank = () => {
  return (

    <div className="relative  w-full h-screen">
      <ToprankInfo />
      <div className="relative text-left">
        <ToprankList />
      </div>
    </div>
  );
};

export default Toprank;
