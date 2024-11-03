import React from "react";
import { useSelector } from "react-redux";
import UserDropdown from "../Dropdowns/UserDropdown.js";
import NotificationDropdown from "../Dropdowns/NotificationDropdown.js";
import { useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  let currentPage = pathParts.pop();

  if (!isNaN(currentPage)) {
    currentPage = pathParts.pop();
  }

  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state) => state.auth.user);

  return (
    <nav className="z-10 bg-transparent md:flex-row md:flex-nowrap flex items-center p-4 shadow-md">
      <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
        {/* Brand */}
        <a
          className="text-black text-sm uppercase hidden lg:inline-block font-semibold"
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          {currentPage}
        </a>
        
        {/* User */}
        <div className="flex items-center space-x-10">
          <NotificationDropdown />
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <UserDropdown user={user} /> {/* Truyền user vào UserDropdown */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
