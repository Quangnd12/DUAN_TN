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
import { useTheme as useMuiTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { usePlayerContext } from "../audio/playerContext";
import { useTheme as useCustomTheme } from "../../views/admin/ThemeContext";

import {
  MdDashboard,
  MdHome,
  MdPerson,
  MdMusicNote,
  MdCategory,
  MdMic,
  MdAlbum,
  MdReport,
  MdExplore,
  MdTrendingUp,
  MdNewReleases,
  MdBarChart,
  MdInsights,
  MdAdminPanelSettings,
  MdMusicVideo,
  MdAssessment,
  MdPublic,
  MdEvent,
} from "react-icons/md";

const translations = {
  vi: {
    title: "Music Heals",
    categories: {
      "Admin Layout Pages": "Trang Quản Trị",
      "Music Discovery Pages": "Khám Phá Nhạc",
      "Report Pages": "Báo Cáo",
    },
    menuItems: {
      Dashboard: "Bảng Điều Khiển",
      Home: "Trang Chủ",
      User: "Người Dùng",
      Song: "Bài Hát",
      Genre: "Thể Loại",
      Artist: "Nghệ Sĩ",
      Album: "Album",
      Explore: "Khám Phá",
      Trending: "Xu Hướng",
      "New Releases": "Mới Phát Hành",
      Country: "Quốc Gia",
      Analytics: "Phân Tích",
      Insights: "Thông Tin Chi Tiết",
      Report: "Báo Cáo",
      Event: "Sự kiện",
    },
  },
  en: {
    title: "Music Heals",
    categories: {
      "Admin Layout Pages": "Admin Layout Pages",
      "Music Discovery Pages": "Music Discovery Pages",
      "Report Pages": "Report Pages",
    },
    menuItems: {
      Dashboard: "Dashboard",
      Home: "Home",
      User: "User",
      Song: "Song",
      Genre: "Genre",
      Artist: "Artist",
      Album: "Album",
      Explore: "Explore",
      Trending: "Trending",
      "New Releases": "New Releases",
      Country: "Country",
      Analytics: "Analytics",
      Insights: "Insights",
      Report: "Report",
      Event: "Event",
    },
  },
};

export default function Sidebar() {
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const { theme, language } = useCustomTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const [open, setOpen] = useState(() => {
    const savedOpen = localStorage.getItem("sidebarOpen");
    return savedOpen !== null ? JSON.parse(savedOpen) : true;
  });

  const [openCategories, setOpenCategories] = useState({});

  const { isPlayerVisible } = usePlayerContext();

  const t = translations[language];

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
    <Tooltip title={t.menuItems[label]} placement="right" arrow>
      <ListItem
        component={NavLink}
        to={to}
        selected={isActive(to)}
        sx={{
          color:
            theme === "dark"
              ? isActive(to)
                ? "black"
                : "rgba(0,0,0,0.7)"
              : isActive(to)
              ? "white"
              : "rgba(255,255,255,0.7)",
          "&:hover": {
            color: "black",
            backgroundColor: "rgba(231, 187, 40, 0.51)",
          },
          transition: "all 0.3s",
          borderRadius: "8px",
          margin: "4px 0",
        }}
      >
        <ListItemIcon>
          <Icon
            style={{
              color:
                theme === "dark"
                  ? isActive(to)
                    ? "black"
                    : "rgba(0,0,0,0.7)"
                  : "white",
              fontSize: "2rem",
            }}
          />
        </ListItemIcon>
        {open && <ListItemText primary={t.menuItems[label] || label} />}
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
        { to: "/admin/event", icon: MdEvent, label: "Event" },
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
        { to: "/admin/countries", icon: MdPublic, label: "Country" },
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
  ];

  const drawerContent = (
    <Box
      sx={{
        height: isPlayerVisible ? "calc(100% - 86px)" : "100%",
        zIndex: 1,
        background: theme === "dark" ? "#ffffff" : "#000000",
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
          backgroundColor: theme === "dark" ? "#999999" : "#ffffff",
        },
        "&:hover::-webkit-scrollbar-thumb": {
          backgroundColor:
            theme === "dark" ? "rgba(0,0,0,.2)" : "rgba(255,255,255,.2)",
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
              color: theme === "dark" ? "black" : "white",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            {t.title}
          </NavLink>
        )}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: theme === "dark" ? "black" : "white" }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <List sx={{ pt: 0 }}>
        {categories.map((category, index) => (
          <React.Fragment key={index}>
            <Tooltip
              title={t.categories[category.title]}
              placement="right"
              arrow
            >
              <ListItem
                onClick={() => handleCategoryToggle(category.title)}
                sx={{
                  cursor: "pointer",
                  color: theme === "dark" ? "black" : "white",
                  "&:hover": {
                    backgroundColor: "rgba(231, 187, 40, 0.51)",
                  },
                  transition: "all 0.3s",
                  borderRadius: "5px",
                  margin: "4px 0",
                }}
              >
                <ListItemIcon>
                  <category.icon
                    style={{
                      color: theme === "dark" ? "black" : "white",
                      fontSize: "2rem",
                    }}
                  />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={t.categories[category.title]}
                    sx={{ color: theme === "dark" ? "black" : "white" }}
                  />
                )}
                {open &&
                  (openCategories[category.title] ? (
                    <ExpandLess
                      sx={{ color: theme === "dark" ? "black" : "white" }}
                    />
                  ) : (
                    <ExpandMore
                      sx={{ color: theme === "dark" ? "black" : "white" }}
                    />
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
              transition: muiTheme.transitions.create("width", {
                easing: muiTheme.transitions.easing.sharp,
                duration: muiTheme.transitions.duration.enteringScreen,
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
          sx={{
            mr: 2,
            position: "absolute",
            top: 8,
            left: 8,
            color: theme === "dark" ? "black" : "white",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  );
}
