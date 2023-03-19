import React from "react";
import CarTaxi from "../assets/Car-Taxi.png";
import RTA from "../assets/RTA.png";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Typography } from "@mui/material";

const Nav = () => {
  return (
    <>
      <Box sx={{ marginBottom: "20px" }}>
        <ImageList
          sx={{ display: "flex", justifyContent: "space-between" }}
          cols={2}
        >
          <ImageListItem key="cartaxi">
            <img src={CarTaxi} alt="Car Taxi" loading="lazy" />
          </ImageListItem>
          <ImageListItem key="rta">
            <img
              src={RTA}
              alt="RTA"
              loading="lazy"
              style={{ objectFit: "fill" }}
            />
          </ImageListItem>
        </ImageList>
      </Box>
      <Typography variant="h4">Customer Feedback</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        Please help us to share your ride experience with Cars Taxi (CT-3422)
      </Typography>
    </>
  );
};

export default Nav;
