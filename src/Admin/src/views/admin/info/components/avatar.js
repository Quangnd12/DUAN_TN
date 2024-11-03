import React from 'react';
import { Avatar, Typography, Box } from "@mui/material";

const UserAvatar = ({ user, onAvatarClick, onAvatarUpload, avatarInputRef }) => (
  <Box className="flex flex-col items-center space-y-4">
    <input
      type="file"
      ref={avatarInputRef} // Gán ref vào input
      style={{ display: "none" }}
      accept="image/*"
      onChange={onAvatarUpload}
    />
    <Avatar
      src={`${user?.avatar}` || "/default-avatar.png"}
      alt={user?.username || "User"}
      className="w-32 h-32 border-4 border-white"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/default-avatar.png";
      }}
      onClick={onAvatarClick}
    />
    <Typography variant="h5" className="font-bold">
      {user?.username}
    </Typography>
    <Typography variant="subtitle1" className="text-indigo-200">
      Music Enthusiast
    </Typography>
    <div className="mt-6 w-full">
      <Typography variant="body1">Email: {user.email || "N/A"}</Typography>
      <Typography variant="body1" className="mt-4 mb-2">
        Member Since: {user.birthday ? new Date(user.birthday).toLocaleDateString("en-GB") : "N/A"}
      </Typography>
    </div>
  </Box>
);

export default UserAvatar;
