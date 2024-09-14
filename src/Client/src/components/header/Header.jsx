import React from "react";

import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Tooltip from "@mui/material/Tooltip";
import SearchInput from "../searchInput/index";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-100 bg-zinc-900 mb-4 rounded-md">
      <div className=" p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Tooltip title="Go Back">
            <div className="rounded-full p-2 bg-gray-500 text-white hover:text-gray-700 cursor-pointer">
              <ArrowBackIosIcon />
            </div>
          </Tooltip>
          <Tooltip title="Go Forward">
            <div className="rounded-full p-2 bg-gray-500 text-white hover:text-gray-700 cursor-pointer">
              <ArrowForwardIosIcon />
            </div>
          </Tooltip>
          <div className="relative left-8">
            <SearchInput></SearchInput>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={"/content"}>
            <div className="relative px-2 py-2 hover:bg-gray-600 rounded-md">
              <Tooltip title="What's New">
                <NotificationsIcon
                  fontSize="large"
                  className="text-white"
                ></NotificationsIcon>
                <div className="absolute top-0 right-1">
                  <CircleIcon
                    fontSize="small"
                    className="text-red-500"
                  ></CircleIcon>
                </div>
              </Tooltip>
            </div>
          </Link>
          <Link to={"/register"}>
            <div className="px-4 py-2 rounded-md text-white">Register</div>
          </Link>
          <Link to={"/login"}>
            <div className="px-4 py-2 rounded-md font-bold bg-white">
              Log in
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
