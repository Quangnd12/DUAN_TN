import React, { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import {
  Drawer,
  IconButton,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
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
  MdCelebration ,
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

  const drawerWidth = open ? 300 : 100;

  const MenuItem = ({ to, icon: Icon, label }) => (
    <Tooltip title={label} placement="right" arrow>
      <ListItem
        component={NavLink}
        to={to}
        selected={isActive(to)}
        style={{ fontSize: "2rem" }}
        sx={{
          color: isActive(to) ? "black" : "white",
          "&:hover": {
            color: "black",
            backgroundColor: "rgba(255,255,255,0.1)",
          },
          transition: "all 0.3s",
          borderRadius: "8px",
          margin: "4px 0",
        }}
      >
        <ListItemIcon>
          <Icon style={{ color: isActive(to) ? "black" : "white", fontSize: "2rem" }} />
        </ListItemIcon>
        {open && <ListItemText primary={label} />}
      </ListItem>
    </Tooltip>
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
        { to: "/admin/playlist", icon: MdQueueMusic, label: "Playlist" },
        { to: "/admin/event", icon: MdCelebration, label: "Event" }, // Cập nhật biểu tượng Event
      ],
    },
    {
      title: "Music Discovery Pages",
      icon: MdMusicVideo,
      items: [
        { to: "/admin/explore", icon: MdExplore, label: "Explore" },
        { to: "/admin/trending", icon: MdTrendingUp, label: "Trending" },
        {
          to: "/admin/new-releases",
          icon: MdNewReleases,
          label: "New Releases",
        },
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
        overflow: "auto",
        position: "relative",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ffffff", // Màu trắng của thanh kéo
          borderRadius: "5px", // Bo góc thanh kéo
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", // Hiệu ứng đổ bóng cho thanh kéo
          transition: "background-color 0.3s ease, box-shadow 0.3s ease", // Hiệu ứng mượt khi hover
        },
        "&:hover::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,.2)",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {open && (
          <NavLink
            to="/admin/dashboard"
            style={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
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
            <Tooltip title={category.title} placement="right" arrow>
              <ListItem
                onClick={() => handleCategoryToggle(category.title)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  transition: "all 0.3s",
                  borderRadius: "5px",
                  margin: "4px 0",
                }}
              >
                <ListItemIcon>
                  <category.icon color="white" style={{ fontSize: "2rem" }} />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={category.title}
                    sx={{ color: "white" }}
                  />
                )}
                {open &&
                  (openCategories[category.title] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  ))}
              </ListItem>
            </Tooltip>
            <Collapse
              in={openCategories[category.title]}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding sx={{ pl: 2 }}>
                {category.items.map((item, itemIndex) => (
                  <MenuItem key={itemIndex} {...item}  />
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
