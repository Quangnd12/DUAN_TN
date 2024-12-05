import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { useGetUserFollowedArtistsQuery } from "../../../../redux/slice/followSlice";
import Tooltip from "@mui/material/Tooltip";

const NotificationBell = () => {
  const { data: followedArtists } = useGetUserFollowedArtistsQuery();
  const [notificationsViewed, setNotificationsViewed] = useState(() => {
    // Lấy trạng thái từ localStorage khi khởi tạo
    const savedState = localStorage.getItem('notificationsViewed');
    return savedState ? JSON.parse(savedState) : {};
  });

  // Đếm số bài hát mới
  const newSongs = followedArtists?.reduce((acc, artist) => {
    const newSongsCount = artist.songs?.filter(song => {
      const songDate = new Date(song.releaseDate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - songDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Kiểm tra xem bài hát đã được xem chưa
      const songKey = `song-${song.id}`;
      const isViewed = notificationsViewed[songKey];
      
      return diffDays <= 7 && !isViewed;
    }).length || 0;
    return acc + newSongsCount;
  }, 0);

  const hasNewSongs = newSongs > 0;

  const handleNotificationClick = () => {
    // Lưu trạng thái đã xem cho tất cả bài hát mới
    const updatedNotificationsViewed = { ...notificationsViewed };
    
    followedArtists?.forEach(artist => {
      artist.songs?.forEach(song => {
        const songDate = new Date(song.releaseDate);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - songDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7) {
          const songKey = `song-${song.id}`;
          updatedNotificationsViewed[songKey] = true;
        }
      });
    });

    setNotificationsViewed(updatedNotificationsViewed);
    // Lưu vào localStorage
    localStorage.setItem('notificationsViewed', JSON.stringify(updatedNotificationsViewed));
  };

  // Tự động cập nhật localStorage khi notificationsViewed thay đổi
  useEffect(() => {
    localStorage.setItem('notificationsViewed', JSON.stringify(notificationsViewed));
  }, [notificationsViewed]);

  // Xóa các bài hát cũ khỏi notificationsViewed (tùy chọn)
  useEffect(() => {
    const cleanupOldNotifications = () => {
      const updatedNotificationsViewed = { ...notificationsViewed };
      let hasChanges = false;

      Object.keys(updatedNotificationsViewed).forEach(key => {
        // Kiểm tra xem bài hát còn tồn tại trong danh sách không
        const songExists = followedArtists?.some(artist =>
          artist.songs?.some(song => `song-${song.id}` === key)
        );

        if (!songExists) {
          delete updatedNotificationsViewed[key];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setNotificationsViewed(updatedNotificationsViewed);
        localStorage.setItem('notificationsViewed', JSON.stringify(updatedNotificationsViewed));
      }
    };

    if (followedArtists) {
      cleanupOldNotifications();
    }
  }, [followedArtists]);

  return (
    <Tooltip title={hasNewSongs ? `${newSongs} new songs from your followed artists` : "No new notifications"}>
      <div className="relative px-2 py-2 hover:bg-gray-600 rounded-md cursor-pointer" onClick={handleNotificationClick}>
        <NotificationsIcon fontSize="large" className="text-white" />
        {hasNewSongs && (
          <div className="absolute top-0 right-1">
            <CircleIcon fontSize="small" className="text-red-500" />
          </div>
        )}
      </div>
    </Tooltip>
  );
};

export default NotificationBell; 