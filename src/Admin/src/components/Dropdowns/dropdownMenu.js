import React, { useEffect, useRef } from 'react';
import { MdEdit, MdDelete, MdVisibility } from 'react-icons/md';

const DropdownMenu = ({ isOpen, onEdit, onPreview, onDelete, onToggle, showPreview }) => {
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
            <MdEdit className='mr-2' /> Edit
          </button>
          {showPreview && (
            <button
              onClick={onPreview}
              className="flex items-center px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <MdVisibility className='mr-2' /> Preview
            </button>
          )}

          <button
            onClick={onDelete}
            className="flex items-center px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100 w-full text-left"
          >
            <MdDelete className='mr-2' /> Delete
          </button>
        </div>
      )}
    </>
  );
};

export default DropdownMenu;
