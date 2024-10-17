import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { MdBuildCircle } from "react-icons/md";

const UnderDevelopment = () => {
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
          Developing
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          This page is under development. We are working hard to complete it as
          soon as possible.
        </Typography>
        <Typography variant="body2" className="mt-4 text-gray-500">
          Please come back later or contact the development team for more
          information.
        </Typography>
      </Paper>
    </Box>
  );
};

export default UnderDevelopment;
