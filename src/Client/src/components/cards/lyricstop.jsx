import React from "react";
import Tb from '../../../public/assets/img/CoverArt2.jpg';

const Lyricstop = () => {
  return (
    <div className="flex justify-center  mr-[350px]">
      <img src={Tb} alt="Profile 1" className="w-12 h-12 rounded-full border-2 border-white" />
      <img src={Tb} alt="Profile 2" className="w-12 h-12 rounded-full border-2 border-white ml-2" />
      <img src={Tb} alt="Profile 3" className="w-12 h-12 rounded-full border-2 border-white ml-2" />
      <img src={Tb} alt="Profile 4" className="w-12 h-12 rounded-full border-2 border-white ml-2" />
    </div>
  );
};

export default Lyricstop;
