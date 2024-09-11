import React, { useEffect, useRef } from 'react';

const DropdownMenu = ({ isOpen, onEdit, onPreview, onDelete, onToggle }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <>
      {isOpen && (
        <div className="absolute right-9 mt-3 w-32 sm:w-40 md:w-48 bg-white rounded-md shadow-lg z-10" ref={dropdownRef}>
          <button
            onClick={onEdit}
            className="flex items-center px-4 py-2 text-xs sm:text-sm text-blue-600 hover:bg-gray-100 w-full text-left"
          >
            <i className="fas fa-edit mr-2"></i> Edit
          </button>
          <button
            onClick={onPreview}
            className="flex items-center px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <i className="fas fa-eye mr-2"></i> Preview
          </button>
          <button
            onClick={onDelete}
            className="flex items-center px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100 w-full text-left"
          >
            <i className="fas fa-trash-alt mr-2"></i> Delete
          </button>
        </div>
      )}
    </>
  );
};

export default DropdownMenu;
