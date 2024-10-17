import React from "react";
import AdminProfile from "./components/profile";

export default function Info() {
  const user = {
    username: "MusicLover123",
    email: "musiclover123@example.com",
    avatar: "/path-to-avatar.jpg",
    birthday: "1990-01-01",
  };

  return (
    <div className="pt-1">
      <AdminProfile user={user} />
    </div>
  );
}