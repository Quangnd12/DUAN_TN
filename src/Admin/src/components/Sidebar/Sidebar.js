import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Drawer, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NotificationDropdown from "../Dropdowns/NotificationDropdown.js";
import UserDropdown from "../Dropdowns/UserDropdown.js";
import {
  MdDashboard,
  MdSettings,
  MdMusicNote,
  MdLogout,
  MdMic,
  MdHome,
} from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(() => {
    const savedOpen = localStorage.getItem("sidebarOpen");
    return savedOpen !== null ? JSON.parse(savedOpen) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(open));
  }, [open]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const isActive = (path) => location.pathname === path;

  const drawerWidth = open ? 240 : 73;

  const MenuItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={`flex items-center py-3 px-4 text-sm font-bold uppercase ${
        isActive(to)
          ? "text-cyan-400 hover:text-cyan-500"
          : "text-white hover:text-cyan-500"
      }`}
    >
      <Icon
        className={`mr-2 text-lg ${
          isActive(to) ? "text-cyan-400" : "text-gray-300"
        }`}
      />
      {open && <span>{label}</span>}
    </NavLink>
  );

  const drawerContent = (
    <>
      <div className="flex justify-between items-center p-4">
        {open && (
          <NavLink
            to="/admin/dashboard"
            className="text-gray-300 text-lg font-bold"
          >
            Music Heals
          </NavLink>
        )}
        <IconButton onClick={handleDrawerToggle} className="text-white">
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <div className="mt-5 ml-2">
        <MenuItem to="/admin/dashboard" icon={MdDashboard} label="Dashboard" />
        <MenuItem to="/admin/home" icon={MdHome} label="Home" />
        <MenuItem to="/admin/song" icon={MdMusicNote} label="Song" />
        <MenuItem to="/admin/artist" icon={MdMic} label="Artist" />
        <MenuItem to="/admin/settings" icon={MdSettings} label="Settings" />
        <MenuItem to="/admin/logout" icon={MdLogout} label="Log out" />
      </div>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: theme.palette.grey[800],
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: theme.palette.grey[800],
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, position: "absolute", top: 8, left: 8 }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  );
}
