import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { useGetUserFollowedArtistsQuery } from "../../../../redux/slice/followSlice";
import Tooltip from "@mui/material/Tooltip";
import { translations } from "../../utils/translations/translations"; // Import translations
import { useTheme } from "../../utils/ThemeContext"; // Import useTheme

const NotificationBell = () => {
  const { data: followedArtists } = useGetUserFollowedArtistsQuery();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationsViewed, setNotificationsViewed] = useState(() => {
    const savedState = localStorage.getItem('notificationsViewed');
    return savedState ? JSON.parse(savedState) : {};
  });
  const { language } = useTheme(); // Lấy ngôn ngữ từ context

  // Đếm số bài hát mới
  const newSongs = followedArtists?.reduce((acc, artist) => {
    const newSongsCount = artist.songs?.filter(song => {
      const songDate = new Date(song.releaseDate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - songDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const songKey = `song-${song.id}`;
      const isViewed = notificationsViewed[songKey];
      
      return diffDays <= 7 && !isViewed;
    }).length || 0;
    return acc + newSongsCount;
  }, 0);

  const hasNewSongs = newSongs > 0;

  // Thêm useEffect để xử lý độ trễ hiển thị thông báo
  useEffect(() => {
    if (hasNewSongs) {
      // Ban đầu ẩn thông báo
      setShowNotification(false);
      
      // Sau 5 giây mới hiển thị thông báo
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowNotification(false);
    }
  }, [hasNewSongs]);

  const handleNotificationClick = () => {
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
    localStorage.setItem('notificationsViewed', JSON.stringify(updatedNotificationsViewed));
    setShowNotification(false);
  };

  useEffect(() => {
    localStorage.setItem('notificationsViewed', JSON.stringify(notificationsViewed));
  }, [notificationsViewed]);

  useEffect(() => {
    const cleanupOldNotifications = () => {
      const updatedNotificationsViewed = { ...notificationsViewed };
      let hasChanges = false;

      Object.keys(updatedNotificationsViewed).forEach(key => {
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
    <Tooltip title={hasNewSongs ? `${newSongs} ${translations[language].notifications.justNow} từ nghệ sĩ bạn theo dõi` : translations[language].notifications.noNotifications}>
      <div className="relative px-2 py-2 hover:bg-gray-600 rounded-md cursor-pointer" onClick={handleNotificationClick}>
        <NotificationsIcon fontSize="large" className="text-white" />
        {showNotification && hasNewSongs && (
          <div className="absolute top-0 right-1">
            <CircleIcon fontSize="small" className="text-red-500" />
          </div>
        )}
      </div>
    </Tooltip>
  );
};

export default NotificationBell; 