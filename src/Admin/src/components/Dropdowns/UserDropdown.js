import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPopper } from "@popperjs/core";
import { logoutUser } from "../../../../services/Api_url";
import CircularProgress from "@mui/material/CircularProgress";

const Dropdown = ({ buttonContent, dropdownContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      createPopper(buttonRef.current, dropdownRef.current, {
        placement: "bottom-start",
      });
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="focus:outline-none"
      >
        {buttonContent}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {dropdownContent}
          </div>
        </div>
      )}
    </div>
  );
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserData(user);
    }
    const isLoggedOut = sessionStorage.getItem("isLoggedOut");
    if (isLoggedOut === "true") {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      // Thêm delay để hiển thị loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Đặt flag đăng xuất trước khi xóa dữ liệu
      sessionStorage.setItem("isLoggedOut", "true");
      localStorage.clear();
      sessionStorage.removeItem("lastLoginTime");

      // Chuyển hướng về trang login
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Trong trường hợp lỗi, vẫn xóa dữ liệu và đặt flag
      sessionStorage.setItem("isLoggedOut", "true");
      localStorage.clear();
      sessionStorage.removeItem("lastLoginTime");
      navigate("/auth/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Nếu không có userData, hiển thị placeholder hoặc loading
  if (!userData) {
    return (
      <div className="flex items-center py-3">
        <span className="mr-2">Loading...</span>
      </div>
    );
  }

  return (
    <Dropdown
      buttonContent={
        <div className="flex items-center py-3">
          <span className="mr-2">
            {userData.displayName || userData.name || userData.username}
          </span>
          <img
            className="h-8 w-8 rounded-full"
            src={
              userData.avatar ||
              userData.picture ||
              "/images/default-avatar.png"
            }
            alt="User avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-avatar.png";
            }}
          />
        </div>
      }
      dropdownContent={
        <>
          <Link
            to={`/admin/info/${userData.id}`} // Thay đổi từ :id thành userData._id
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-sm"
          >
            Personal information
          </Link>
          <a
            href="http://localhost:3000/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-sm"
          >
            Go to Client Site
          </a>
          <Link
            to="/admin/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-sm"
          >
            Setting
          </Link>
          <hr className="my-1" />
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 hover:rounded-sm"
          >
            {isLoggingOut ? (
              <div className="flex items-center">
                <CircularProgress size={16} className="mr-2" />
                <span>Signing out...</span>
              </div>
            ) : (
              "Sign out"
            )}
          </button>
        </>
      }
    />
  );
};

const UserDropdown = () => {
  return (
    <div className="flex items-center space-x-4">
      <UserProfile />
    </div>
  );
};

export default UserDropdown;
