import { Typography, Box } from "@mui/material";
import React from "react";

export const InvalidQRCode = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5">"Invalid or Expired QR code"</Typography>
      <Typography variant="h5">Please Try Again!! </Typography>
    </Box>
  );
};
