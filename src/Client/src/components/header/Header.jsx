import React from "react";

import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchInput from "../searchInput/index";
import BellIcon from "../Icons/BellIcon";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-100 bg-[var(--black-color)]">
      <div className=" p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="rounded-full p-2 bg-gray-800 text-gray-500 hover:text-white cursor-pointer">
            <ArrowBackIosIcon />
          </div>
          <div className="rounded-full p-2 bg-gray-800 text-gray-500 hover:text-white cursor-pointer">
            <ArrowForwardIosIcon />
          </div>
          <SearchInput></SearchInput>
        </div>

        <div className="flex gap-2">
        <Link to={"/content"}>
          <div className="mt-3 hover:bg-gray-600 rounded-full">
            <BellIcon></BellIcon>
          </div>
          </Link>
          <Link to={"/register"}>
            <div
              style={{
                background: "linear-gradient(to bottom, #888888, #000000)",
              }}
              className="p-4 rounded-full text-white"
            >
              Register
            </div>
          </Link>
          <Link to={"/login"}>
            <div className="p-4 rounded-full font-bold bg-white">Login</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
