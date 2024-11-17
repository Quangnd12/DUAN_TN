import React, { useState } from "react";
import { Routes } from "react-router-dom";
import { Box } from "@mui/material";

// components
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

// Import routes
import AdminRoutes from "../views/admin/routes.js";

import { ThemeProvider } from '../views/admin/ThemeContext.js';

import "../assets/styles/index.css";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedOpen = localStorage.getItem("sidebarOpen");
    return savedOpen !== null ? JSON.parse(savedOpen) : true;
  });

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <ThemeProvider>
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { sm: `calc(80% - ${sidebarOpen ? "10px" : "5px"})` },
          marginLeft: { sm: sidebarOpen ? "10px" : "5px" },
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <AdminNavbar />
        <Box sx={{ mt: 2 }}>
          <Routes>{AdminRoutes}</Routes>
        </Box>
      </Box>
      </ThemeProvider>
    </Box>
  );
};

export default Admin;
