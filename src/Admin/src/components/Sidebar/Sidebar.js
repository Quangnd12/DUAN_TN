import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Drawer, IconButton, useMediaQuery, List, ListItem, ListItemIcon, ListItemText, Collapse, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import {
  MdDashboard,
  MdHome,
  MdPerson,
  MdMusicNote,
  MdCategory,
  MdMic,
  MdAlbum,
  MdQueueMusic,
  MdLyrics,
  MdFavorite,
  MdReport,
  MdExplore,
  MdTrendingUp,
  MdNewReleases,
  MdBarChart,
  MdInsights,
  MdSettings,
  MdPerson as MdProfile,
  MdAdminPanelSettings,
  MdMusicVideo,
  MdAssessment,
  MdAccountCircle,
} from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(() => {
    const savedOpen = localStorage.getItem("sidebarOpen");
    return savedOpen !== null ? JSON.parse(savedOpen) : true;
  });

  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(open));
  }, [open]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleCategoryToggle = (category) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const isActive = (path) => location.pathname === path;

  const drawerWidth = open ? 300 : 73;

  const MenuItem = ({ to, icon: Icon, label }) => (
    <ListItem
      component={NavLink}
      to={to}
      selected={isActive(to)}
      sx={{
        color: isActive(to) ? "cyan.400" : "white",
        "&:hover": { color: "cyan.500", backgroundColor: "rgba(255,255,255,0.1)" },
        transition: "all 0.3s",
        borderRadius: "8px",
        margin: "4px 0",
      }}
    >
      <ListItemIcon>
        <Icon color={isActive(to) ? "cyan" : "inherit"} />
      </ListItemIcon>
      {open && <ListItemText primary={label} />}
    </ListItem>
  );

  const categories = [
    {
      title: "Admin Layout Pages",
      icon: MdAdminPanelSettings,
      items: [
        { to: "/admin/dashboard", icon: MdDashboard, label: "Dashboard" },
        { to: "/admin/home", icon: MdHome, label: "Home" },
        { to: "/admin/user", icon: MdPerson, label: "User" },
        { to: "/admin/song", icon: MdMusicNote, label: "Song" },
        { to: "/admin/genre", icon: MdCategory, label: "Genre" },
        { to: "/admin/artist", icon: MdMic, label: "Artist" },
        { to: "/admin/album", icon: MdAlbum, label: "Album" },
      ],
    },
    {
      title: "Music Discovery Pages",
      icon: MdMusicVideo,
      items: [
        { to: "/admin/explore", icon: MdExplore, label: "Explore" },
        { to: "/admin/trending", icon: MdTrendingUp, label: "Trending" },
        { to: "/admin/new-releases", icon: MdNewReleases, label: "New Releases" },
      ],
    },
    {
      title: "Report Pages",
      icon: MdAssessment,
      items: [
        { to: "/admin/analytics", icon: MdBarChart, label: "Analytics" },
        { to: "/admin/insights", icon: MdInsights, label: "Insights" },
        { to: "/admin/report", icon: MdReport, label: "Report" },
      ],
    },
    {
      title: "Profile Layout Pages",
      icon: MdAccountCircle,
      items: [
        { to: "/admin/settings", icon: MdSettings, label: "Settings" },
        { to: "/admin/profile", icon: MdProfile, label: "Profile" },
      ],
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          animation: "pulse 15s infinite",
        },
        "@keyframes pulse": {
          "0%": { opacity: 0.5 },
          "50%": { opacity: 1 },
          "100%": { opacity: 0.5 },
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {open && (
          <NavLink to="/admin/dashboard" style={{ textDecoration: "none", color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>
            Music Heals
          </NavLink>
        )}
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <List sx={{ pt: 0 }}>
        {categories.map((category, index) => (
          <React.Fragment key={index}>
            <ListItem
              onClick={() => handleCategoryToggle(category.title)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                transition: "all 0.3s",
                borderRadius: "8px",
                margin: "4px 0",
              }}
            >
              <ListItemIcon>
                <category.icon color="white" />
              </ListItemIcon>
              {open && <ListItemText primary={category.title} sx={{ color: "white" }} />}
              {open && (openCategories[category.title] ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            <Collapse in={openCategories[category.title]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 2 }}>
                {category.items.map((item, itemIndex) => (
                  <MenuItem key={itemIndex} {...item} />
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "transparent",
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
              backgroundColor: "transparent",
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