import React from "react";
import UserDropdown from "../Dropdowns/UserDropdown.js";
import { useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  let currentPage = pathParts.pop();
  
  if (!isNaN(currentPage)) {
    currentPage = pathParts.pop(); 
  }
  return (
    <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
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
        <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
          <UserDropdown />
        </ul>
      </div>
    </nav>
  );
}
