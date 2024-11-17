import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
  Fade,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { markAllAsRead, markAsRead } from "../../../../redux/slice/notificationSlice";
import { useTheme } from '../../views/admin/ThemeContext'; 
import { translations } from '../Translation/translation';

const getIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon className="text-green-500" />;
    case "error":
      return <ErrorIcon className="text-red-500" />;
    case "user":
      return <PersonAddIcon className="text-blue-500" />;
    default:
      return <InfoIcon className="text-gray-500" />;
  }
};

// Sửa lại hàm formatTime để handle cả string time
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    // Convert any time string to Date object
    const date = new Date(timeString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    const now = new Date();
    const diff = now - date;
    
    // Just now - less than 1 minute ago
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Minutes ago - less than 1 hour ago
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Hours ago - less than 24 hours ago
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Today - show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      })}`;
    }
    
    // Default format for older dates
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString; // Return original string if parsing fails
  }
};

export default function NotificationDropdown() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const { language } = useTheme();
  const t = translations[language].notifications;
  
  // Log state để debug
  const notificationState = useSelector((state) => state.notifications);
  console.log('Notification State:', notificationState);
  
  const { notifications, unreadCount } = notificationState;

  const [showNewNotification, setShowNewNotification] = React.useState(false);

  useEffect(() => {
    // Log để debug
    console.log('Current notifications:', notifications);
    console.log('Unread count:', unreadCount);
    
    if (unreadCount > 0) {
      setShowNewNotification(true);
      const timer = setTimeout(() => {
        setShowNewNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount, notifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowNewNotification(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
    handleClose();
  };

  const handleNotificationClick = (id) => {
    console.log('Marking notification as read:', id);
    dispatch(markAsRead(id));
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <div className="relative">
      <IconButton 
        aria-describedby={id} 
        onClick={handleClick}
        className={`transition-transform duration-200 ${showNewNotification ? 'animate-bounce' : ''}`}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          className={`${showNewNotification ? 'animate-pulse' : ''}`}
        >
          <NotificationsIcon className={unreadCount > 0 ? 'text-blue-500' : 'text-gray-500'} />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="mt-2"
      >
        <div className="w-96 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-white p-3 border-b flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <Typography variant="h6" className="font-medium">
              {t.title} ({notifications?.length || 0})
              </Typography>
              {unreadCount > 0 && (
                <Badge badgeContent={unreadCount} color="error" className="ml-2" />
              )}
            </div>
            {unreadCount > 0 && (
              <Button 
                onClick={handleMarkAllRead} 
                color="primary" 
                size="small"
                className="text-sm"
              >
                 {t.markAllAsRead}
              </Button>
            )}
          </div>

          <List className="py-0">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <Fade in key={notification.id}>
                  <ListItem
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`
                      hover:bg-gray-50 
                      transition-colors 
                      duration-200 
                      cursor-pointer 
                      border-b
                      ${!notification.read ? 'bg-blue-50' : ''}
                    `}
                  >
                    <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" className="font-medium">
                          {notification.message}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" className="text-gray-500">
                          {formatTime(notification.time, language)}
                        </Typography>
                      }
                    />
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 ml-2" />
                    )}
                  </ListItem>
                </Fade>
              ))
            ) : (
              <ListItem className="py-8">
                <ListItemText 
                  primary={
                    <Typography 
                      variant="body1" 
                      className="text-center text-gray-500"
                    >
                      {t.noNotifications}
                    </Typography>
                  } 
                />
              </ListItem>
            )}
          </List>
        </div>
      </Popover>
    </div>
  );
}