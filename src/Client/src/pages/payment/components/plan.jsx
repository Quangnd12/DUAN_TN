import React from 'react';
import {MdCheck} from "react-icons/md"
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

const PricingPlans = () => {
  const { user,isAuthenticated } = useSelector((state) => state.auth);

  return (
<div className="container mx-auto p-4">
  <div className="flex justify-center items-center">
    <div className="plan bg-[#140e85] p-6 rounded-lg shadow-lg text-center w-[550px]">
      <div className="flex justify-center mr-2">
        <h3 className="text-2xl font-bold text-gray-800 text-white">MUSIC HEALS</h3>
        <span className="bg-yellow-500 text-white text-[16px] font-bold px-2 py-1 rounded ml-2 shrink-0">
          PREMIUM
        </span>
      </div>
      <p className="mt-8 text-[28px] font-bold text-white">5$/Month</p>
      <ul className="mt-8 text-left text-gray-700">
        <li className="flex items-center text-white mb-2">
          <MdCheck className="mr-2" size={20} />Premium music store
        </li>
        <li className="flex items-center text-white mb-2">
          <MdCheck className="mr-2" size={20} />Download high quality music
        </li>
        <li className="flex items-center text-white">
          <MdCheck className="mr-2" size={20} />Experience the new album in advance
        </li>
      </ul>
      <Link to={isAuthenticated? '/payment' : '/login'}>
       <button className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
        Nâng cấp ngay
      </button>
      </Link>
     
    </div>
  </div>
</div>

  );
};

export default PricingPlans;
