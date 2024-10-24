import React, { useState } from "react";
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
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AlbumIcon from "@mui/icons-material/Album";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import ReportIcon from "@mui/icons-material/Report";

const notifications = [
  { id: 1, type: "song", message: "New song has been added", time: "3:00 AM" },
  {
    id: 2,
    type: "album",
    message: "New album has been created",
    time: "6:00 PM",
  },
  {
    id: 3,
    type: "artist",
    message: "New artist has been added",
    time: "2:45 PM",
  },
  {
    id: 4,
    type: "playlist",
    message: "A new playlist has been created",
    time: "9:10 PM",
  },
  { id: 5, type: "report", message: "New report from users", time: "11:30 AM" },
];

const getIcon = (type) => {
  switch (type) {
    case "song":
      return <MusicNoteIcon />;
    case "album":
      return <AlbumIcon />;
    case "playlist":
      return <PlaylistPlayIcon />;
    case "report":
      return <ReportIcon />;
    default:
      return <NotificationsIcon />;
  }
};

export default function NotificationDropdown() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(notifications.length);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <div>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
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
      >
        <div className="w-96 ">
          <div className="p-2 border-b flex justify-between items-center">
            <Typography variant="h7">Notification</Typography>
            <Button onClick={handleMarkAllRead} color="primary">
              Mark all as read
            </Button>
          </div>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} className="hover:bg-gray-100">
                <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={notification.time}
                />
              </ListItem>
            ))}
          </List>
          <div className="p-2 border-t">
            <Button fullWidth color="primary">
              View all
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
}
