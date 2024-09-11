import React from "react";
import { createPopper } from "@popperjs/core";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";

const TableDropdown = ({ onEdit, onPreview, onDelete }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.useRef(null);
  const popoverDropdownRef = React.useRef(null);

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const handleClickOutside = (event) => {
    if (
      popoverDropdownRef.current &&
      !popoverDropdownRef.current.contains(event.target) &&
      !btnDropdownRef.current.contains(event.target)
    ) {
      closeDropdownPopover();
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        className="focus:outline-none"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-ellipsis-v cursor-pointer"></i>
      </button>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "absolute right-0 mt-2 w-32 sm:w-40 md:w-48 bg-white rounded-md shadow-lg z-10"
        }
      >
        <button
          onClick={onEdit}
          className="flex items-center px-4 py-2 text-xs sm:text-sm text-blue-600 hover:bg-gray-100 w-full text-left"
        >
          <MdEdit className="mr-2 text-green-600" />
          <span>Edit</span>
        </button>
        <button
          onClick={onPreview}
          className="flex items-center px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          <MdVisibility className="mr-2 text-blue-600" />
          <span>Preview</span>
        </button>
        <button
          onClick={onDelete}
          className="flex items-center px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100 w-full text-left"
        >
          <MdDelete className="mr-2 text-red-600" />
          <span>Delete</span>
        </button>
      </div>
    </>
  );
};

export default TableDropdown;
