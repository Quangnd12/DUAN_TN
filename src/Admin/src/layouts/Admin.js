import React from "react";
import { Routes } from "react-router-dom";

// components
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import HeaderStats from "../components/Headers/HeaderStats.js";

// Import routes
import AdminRoutes from "../views/admin/routes.js";

import "../assets/styles/index.css";

const Admin = () => {
  return (
    <div className="admin-container">
      <Sidebar className="sidebar" />
      <div className="relative md:ml-64 bg-blueGray-100 main-content">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats className="header" />
        <div className="px-4 md:px-5 mx-auto w-full content">
          <Routes>
            {AdminRoutes}
          </Routes>
          {/* <FooterAdmin /> */}
        </div>
      </div>
    </div>
  );
};

export default Admin;
