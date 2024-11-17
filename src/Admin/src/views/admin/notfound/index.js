import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../views/admin/ThemeContext";

const translations = {
  vi: {
    pageNotFound: "Trang bạn tìm kiếm không tồn tại.",
    buttonText: "Quay về Bảng Điều Khiển",
  },
  en: {
    pageNotFound: "Oops! The page you are looking for does not exist.",
    buttonText: "Return to Dashboard",
  },
};

const NotFound = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const t = translations[language];

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      className="bg-gray-100"
    >
      <Typography
        variant="h1"
        className="text-6xl font-bold text-gray-800 mb-4"
      >
        404
      </Typography>
      <Typography variant="h5" className="text-xl text-gray-600 mb-8">
        {t.pageNotFound} {/* Use translation for the page not found message */}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/admin/dashboard")}
        className="bg-blue-500 hover:bg-blue-600"
      >
        {t.buttonText} {/* Use translation for the button text */}
      </Button>
    </Box>
  );
};

export default NotFound;
