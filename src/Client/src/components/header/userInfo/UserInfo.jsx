import React, { useState } from 'react';

const UserInfo = ({ username, avatarUrl }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="relative">
      <div className="flex items-center cursor-pointer" onClick={handleDropdownToggle}>
        <img
          src={avatarUrl}
          alt={username}
          className="w-5 h-5 rounded-full"
        />
        <span className="text-white ml-2">{username}</span>
      </div>
      {dropdownVisible && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-700 text-white text-md rounded py-2 shadow-lg">
          <div className="px-4 py-2 text-left hover:bg-gray-600 cursor-pointer">Tài khoản</div>
          <div className="px-4 py-2 text-left hover:bg-gray-600 cursor-pointer">Hồ sơ</div>
          <div className="px-4 py-2 text-left hover:bg-gray-600 cursor-pointer">Đăng xuất</div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
