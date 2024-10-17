import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom'
import { createPopper } from '@popperjs/core';

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
        placement: 'bottom-start',
      });
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <div className="relative">
      <button ref={buttonRef} onClick={toggleDropdown} className="focus:outline-none">
        {buttonContent}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {dropdownContent}
          </div>
        </div>
      )}
    </div>
  );
};

const UserProfile = () => (
  <Dropdown
    buttonContent={
      <div className="flex items-center py-3">
        <span className="mr-2">Đoàn Quang</span>
        <img
          className="h-8 w-8 rounded-full"
          src="assets/img/team-1-800x800.jpg"
          alt="User avatar"
        />
      </div>
    }
    dropdownContent={
      <>
        <button
          onClick={(e) => e.preventDefault()}
          className="block px-4 py-2 text-left w-full text-sm text-gray-700 hover:bg-gray-100 hover:rounded-sm"
          role="menuitem"
        >
         <Link to="/admin/info"> My information</Link>
        </button>
        <button
          onClick={(e) => e.preventDefault()}
          className="block px-4 py-2 text-left w-full text-sm text-gray-700 hover:bg-gray-100 hover:rounded-sm"
          role="menuitem"
        >
          Another action
        </button>
        <button
          onClick={(e) => e.preventDefault()}
          className="block px-4 py-2 text-left w-full text-sm text-gray-700 hover:bg-gray-100 hover:rounded-sm"
          role="menuitem"
        >
          Something else here
        </button>
        <button
          onClick={(e) => e.preventDefault()}
          className="block px-4 py-2 text-left w-full text-sm text-gray-700 hover:bg-gray-100 hover:rounded-sm"
          role="menuitem"
        >
          Separated link
        </button>
        <button
          onClick={(e) => e.preventDefault()}
          className="block px-4 py-2 text-left w-full text-sm text-gray-700 hover:bg-gray-100 hover:rounded-sm"
          role="menuitem"
        >
           <Link to="/auth/login">Logout</Link>
        </button>
      </>
    }
  />
);

const Notifications = () => (
  <Dropdown
    buttonContent={<i className="fa fa-bell text-xl text-gray-500"></i>}
    dropdownContent={
      <>
        <button
          onClick={(e) => e.preventDefault()}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Notification 1
        </button>
        <button
          onClick={(e) => e.preventDefault()}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Notification 2
        </button>
        <button
          onClick={(e) => e.preventDefault()}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          View all notifications
        </button>
      </>
    }
  />
);

const UserDropdown = () => {
  return (
    <div className="flex items-center space-x-4">
      <UserProfile />
      <Notifications />
    </div>
  );
};

export default UserDropdown;
