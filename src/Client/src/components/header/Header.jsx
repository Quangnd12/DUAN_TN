import axios from "axios";
import { API_BASE_URL } from "../../../../services/Api_url";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import SearchInput from "../searchInput/index";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Tooltip from "@mui/material/Tooltip";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/joy";
import Button from "@mui/joy/Button";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
    setCanGoForward(
      window.history.state &&
        window.history.state.idx < window.history.length - 1
    );

    // Kiểm tra xem người dùng đã đăng nhập chưa
   const loggedInUser = localStorage.getItem("user");
  if (loggedInUser) {
    const parsedUser = JSON.parse(loggedInUser);
    // Đảm bảo rằng user object có id
    if (!parsedUser.id && parsedUser.uid) {
      parsedUser.id = parsedUser.uid;
    }
    setUser(parsedUser);
  }
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

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    if (user && user.id) {
      navigate(`/info/${user.id}`);
    }
    setMenuOpen(false);
  };

  const handleLogout = async () => {
 
    setIsLoggingOut(true);
    try {
      // Xóa token trước khi gọi API
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Gọi API đăng xuất
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      // Xóa thông tin người dùng
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);

      // Kiểm tra lỗi token
      if (error.response && error.response.data) {
        const { tokenExpired } = error.response.data;
        if (tokenExpired) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        }
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="w-full bg-zinc-900 mb-4 rounded-md">
        <div className="p-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Tooltip title={canGoBack ? "Back" : "Can't go back"}>
              <span>
                <div
                  className={`rounded-full p-2 ${
                    canGoBack
                      ? "bg-gray-500 text-white hover:text-gray-700 cursor-pointer"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleGoBack}
                >
                  <ArrowBackIosIcon fontSize="small" className="ml-1" />
                </div>
              </span>
            </Tooltip>
            <Tooltip title={canGoForward ? "Forward" : "Can't go on"}>
              <span>
                <div
                  className={`rounded-full p-2 ${
                    canGoForward
                      ? "bg-gray-500 text-white hover:text-gray-700 cursor-pointer"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleGoForward}
                >
                  <ArrowForwardIosIcon fontSize="small" className="ml-1" />
                </div>
              </span>
            </Tooltip>
            <div className="relative left-8">
              <SearchInput onSearch={handleSearch}></SearchInput>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Link to={"/content"}>
              <Tooltip title="What's news">
                <div className="relative px-2 py-2 hover:bg-gray-600 rounded-md">
                  <NotificationsIcon fontSize="large" className="text-white" />
                  <div className="absolute top-0 right-1">
                    <CircleIcon fontSize="small" className="text-red-500" />
                  </div>
                </div>
              </Tooltip>
            </Link>
            {user ? (
              <div className="relative">
                <div onClick={toggleMenu} className="cursor-pointer flex">
                  <p className="px-4 py-2 text-sm text-white">
                    {user.username}
                  </p>
                  <Avatar
                    alt={user.username}
                    src={user.avatar}
                  />
                </div>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <hr />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                    >
                      Logout
                    </button>
                    <hr />
                    <Button
                      component="label"
                      role={undefined}
                      tabIndex={-1}
                      variant="outlined"
                      color="neutral"
                      startDecorator={<CloudUploadIcon fontSize="small" />}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Upload a file
                      <VisuallyHiddenInput type="file" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to={"/register"}>
                  <div className="px-4 py-2 rounded-md text-white">Sign up</div>
                </Link>
                <Link to={"/login"}>
                  <div className="px-4 py-2 rounded-md font-bold bg-white text-black">
                    Sign in
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg flex flex-col items-center">
            <CircularProgress size={60} className="mb-4" />
            <p className="text-lg font-semibold">Logging out...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
