import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Tooltip from "@mui/material/Tooltip";
import SearchInput from "../searchInput/index";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
    setCanGoForward(window.history.state && window.history.state.idx < window.history.length - 1);
  }, [location]);

  const handleSearch = (query) => {
    if (query) {
      navigate("/search", { state: { query } });
    } else {
      navigate("/search");
    }
  };

  const handleGoBack = () => {
    if (canGoBack) {
      navigate(-1);
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      navigate(1);
    }
  };

  return (
    <div className="w-100 bg-zinc-900 mb-4 rounded-md">
      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Tooltip title={canGoBack ? "Go Back" : "Can't Go Back"}>
            <span> {/* Wrap in a span to provide a single child to Tooltip */}
              <div
                className={`rounded-full p-2 ${canGoBack ? 'bg-gray-500 text-white hover:text-gray-700 cursor-pointer' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                onClick={handleGoBack}
              >
                {canGoBack }
                  <ArrowBackIosIcon fontSize="small" className="ml-1" />
              </div>
            </span>
          </Tooltip>
          <Tooltip title={canGoForward ? "Go Forward" : "Can't Go Forward"}>
            <span> {/* Wrap in a span to provide a single child to Tooltip */}
              <div
                className={`rounded-full p-2 ${canGoForward ? 'bg-gray-500 text-white hover:text-gray-700 cursor-pointer' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                onClick={handleGoForward}
              >
                {canGoForward }
                  <ArrowForwardIosIcon fontSize="small" className="ml-1" />
              </div>
            </span>
          </Tooltip>
          <div className="relative left-8">
            <SearchInput onSearch={handleSearch}></SearchInput>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={"/content"}>
            <Tooltip title="What's New">
              <div className="relative px-2 py-2 hover:bg-gray-600 rounded-md">
                <NotificationsIcon
                  fontSize="large"
                  className="text-white"
                />
                <div className="absolute top-0 right-1">
                  <CircleIcon
                    fontSize="small"
                    className="text-red-500"
                  />
                </div>
              </div>
            </Tooltip>
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