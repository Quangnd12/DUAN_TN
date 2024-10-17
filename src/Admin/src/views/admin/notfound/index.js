import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

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
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/admin/dashboard")}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Return to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
