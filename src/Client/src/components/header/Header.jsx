import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../redux/slice/authSlice";
import { useLogoutMutation } from "../../../../redux/slice/apiSlice";
import { toast } from "react-toastify";
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
import { getPaymentByUser,CheckPayment } from 'services/payment';
import { GiCrown } from 'react-icons/gi';

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
  const dispatch = useDispatch();
  const [canGoBack, setCanGoBack] = useState(false);

  // Lấy thông tin user từ Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [canGoForward, setCanGoForward] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [payment, setPayments] = useState([]);


  // State mới để lưu thông tin hiển thị của user
  const [displayUser, setDisplayUser] = useState({
    avatar: "/images/default-avatar.png",
    username: "",
  });

  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
    setCanGoForward(
      window.history.state &&
      window.history.state.idx < window.history.length - 1
    );
  }, [location]);

  // Effect để xử lý khi user thay đổi
  useEffect(() => {
    if (user) {
      setDisplayUser({
        avatar: user.avatar || "/images/default-avatar.png",
        username:
          user.username || (user.email ? user.email.split("@")[0] : "User"),
      });
    }
  }, [user]);

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
      await logoutMutation().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setMenuOpen(false);
    }
  };

  const getPayment = async () => {
    try {
        if (user) {
            const data = await getPaymentByUser(); 
            setPayments(data || []); 
        }
    } catch (error) {
        console.error("Error fetching payment data", error);
        setPayments([]);
    }
};

useEffect(() => {
    if (user) {
        getPayment();
    }
}, [user]); 

  const checkUserPremium = async () => {
    if (user) {
    await CheckPayment();
    }
}

useEffect(() => {
  if (user) {
    checkUserPremium();
  }
}, [])

  // Render user section based on authentication status
  const renderUserSection = () => {
    if (isAuthenticated && user) {
      return (
        <div className="relative">
          <div onClick={toggleMenu} className="cursor-pointer flex items-center">
            <p className="px-4 py-2 text-sm text-white hover:text-gray-300 flex items-center">
            {displayUser.username}
              {payment.status===1 && ( 
                <GiCrown className="ml-2 text-yellow-500" size={20} />
              )}
            </p>
            <Avatar
              alt={displayUser.username}
              src={displayUser.avatar}
              className="border-2 border-gray-300 hover:border-white"
            />
          </div>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
              <button
                onClick={handleProfileClick}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
              >
                Profile
              </button>
              <hr className="border-gray-700" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
              <hr className="border-gray-700" />
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color="neutral"
                startDecorator={<CloudUploadIcon fontSize="small" />}
                className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-700"
              >
                Upload a file
                <VisuallyHiddenInput type="file" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <Link to="/register">
          <div className="px-4 py-2 rounded-md text-white hover:bg-zinc-800 transition-colors">
            Sign up
          </div>
        </Link>
        <Link to="/login">
          <div className="px-4 py-2 rounded-md font-bold bg-white text-black hover:bg-gray-200 transition-colors">
            Sign in
          </div>
        </Link>
      </>
    );
  };

  return (
    <>
      <div className="w-full bg-zinc-900 mb-4 rounded-md">
        <div className="p-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Tooltip title={canGoBack ? "Back" : "Can't go back"}>
              <span>
                <div
                  className={`rounded-full p-2 ${canGoBack
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
                  className={`rounded-full p-2 ${canGoForward
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
              <SearchInput onSearch={handleSearch} />
            </div>
          </div>

          <div className="flex gap-2 items-center">

            {isAuthenticated && (
              <>

                { !payment.user_id && (
                <Link to="/upgrade">
                  <button className="bg-white text-black text-[16px] font-bold px-3 py-2 rounded-[20px]  mr-6 shrink-0">
                    Premium Upgrade
                  </button>
                  </Link>
               )} 
                <Link to="/content">
                  <Tooltip title="What's news">
                    <div className="relative px-2 py-2 hover:bg-gray-600 rounded-md">

                      <NotificationsIcon
                        fontSize="large"
                        className="text-white"
                      />
                      <div className="absolute top-0 right-1">
                        <CircleIcon fontSize="small" className="text-red-500" />
                      </div>
                    </div>
                  </Tooltip>
                </Link>
              </>
            )}
            {renderUserSection()}
          </div>
        </div>
      </div>
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-md shadow-lg flex flex-col items-center">
            <CircularProgress size={60} className="mb-4" />
            <p className="text-lg font-semibold text-white">Logging out...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
