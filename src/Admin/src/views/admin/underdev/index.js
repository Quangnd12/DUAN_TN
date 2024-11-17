import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { MdBuildCircle } from "react-icons/md";
import { useTheme } from "../../../views/admin/ThemeContext";

const translations = {
  vi: {
    developing: "Đang Phát Triển",
    underDevelopment: "Trang này đang được phát triển. Chúng tôi đang nỗ lực hoàn thành sớm nhất có thể.",
    contactInfo: "Vui lòng quay lại sau hoặc liên hệ với nhóm phát triển để biết thêm thông tin.",
  },
  en: {
    developing: "Developing",
    underDevelopment: "This page is under development. We are working hard to complete it as soon as possible.",
    contactInfo: "Please come back later or contact the development team for more information.",
  },
};

const UnderDevelopment = () => {
  const { language } = useTheme(); // Access the current language from the context
  const t = translations[language]; 

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      className="bg-gray-100"
    >
      <Paper elevation={3} className="p-8 text-center">
        <MdBuildCircle className="text-6xl text-yellow-500 mx-auto mb-4" />
        <Typography variant="h4" className="mb-4 text-gray-800">
        {t.developing}
        </Typography>
        <Typography variant="body1" className="text-gray-600">
        {t.underDevelopment} 
        </Typography>
        <Typography variant="body2" className="mt-4 text-gray-500">
        {t.contactInfo} 
        </Typography>
      </Paper>
    </Box>
  );
};

export default UnderDevelopment;
