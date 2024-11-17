import React from "react";
import { useSelector } from "react-redux";
import UserDropdown from "../Dropdowns/UserDropdown.js";
import NotificationDropdown from "../Dropdowns/NotificationDropdown.js";
import { useLocation } from "react-router-dom";
import { useTheme } from '../../views/admin/ThemeContext.js';
import { Switch } from '@mui/material';

export default function AdminNavbar() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  let currentPage = pathParts.pop();
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();

  if (!isNaN(currentPage)) {
    currentPage = pathParts.pop();
  }

  const user = useSelector((state) => state.auth.user);

  return (
    <nav className={`z-10 md:flex-row md:flex-nowrap flex items-center p-4 shadow-md
      ${theme === 'dark' ? 'bg-white text-black' : 'bg-cyan-400 text-white'} 
      transition-colors duration-200`}>
      <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-2">
        {/* Brand */}
        <a
          className={`text-sm uppercase hidden lg:inline-block font-semibold
            ${theme === 'dark' ? 'text-black' : 'text-white'}`}
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          {currentPage}
        </a>
        
        {/* User and Controls Section */}
        <div className="flex items-center">
          {/* Theme and Language Controls */}
          <div className="flex items-center mr-6">
            {/* Theme Toggle */}
            <div className="flex items-center mr-4">
              <span className="text-lg mr-2">
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
              <Switch 
                checked={theme === 'dark'}
                onChange={toggleTheme}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme === 'dark' ? '#fff' : '#2196f3',
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: theme === 'dark' ? '#ffffff40' : '#0000001f',
                  }
                }}
              />
            </div>

            {/* Language Toggle */}
            <div 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              onClick={toggleLanguage}
            >
              <img
                src={`/images/logo/${language === 'vi' ? 'VN' : 'GB'}.svg`}
                alt={language === 'vi' ? 'Vietnamese' : 'English'}
                className="w-6 h-4 rounded"
              />
              <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-black' : 'text-white'}`}>
                {language === 'vi' ? 'VIE' : 'EN'}
              </span>
            </div>
          </div>

          {/* Notifications and User Profile */}
          <div className="flex items-center space-x-6">
            <NotificationDropdown  />
            <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
              <UserDropdown user={user} />
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}