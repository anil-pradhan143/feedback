import React, { useContext } from "react";
import Box from "@mui/material/Box";
import { AppContext } from "../AppContext";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { HomePageMsg } from "../Constants";
import DriverIcon from "../assets/driver_icon.svg";
import CarIcon from "../assets/car_right.svg";

const Item = styled(Paper)(() => ({
  display: "flex",
  textAlign: "center",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  font: "Raleway",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "16px",
  minWidth: "80%",
  background: "#F2F2F2",
  border: "1px solid #0253A3",
  borderRadius: "5px",
  minHeight: "48px",
  boxShadow: "none",
}));

const StyledBox = styled(Box)(() => ({
  marginBottom: "24px",
}));

export default function CardList(props) {
  const { feedbackData, setFeedbackData, currentPage } = useContext(AppContext);

  const handleClick = (e) => {
    e.preventDefault();
    const currentPageData = {
      key: props?.pageData?.key,
      value: e?.target?.id,
    };
    setFeedbackData((prevData) => {
      return {
        ...prevData,
        [`page${currentPage}`]: currentPageData,
      };
    });

    props.handleSubmit(currentPageData);
  };

  const getCSS = (value) => {
    let cssProperties = {};
    let cssObject;
    let label = "";
    if (value.includes("|")) {
      cssObject = JSON.parse(value?.split("|")[1]);
      label = value?.split("|")[0];
      switch (label?.toLowerCase()?.trim()) {
        case "excellent":
          cssProperties = {
            background: cssObject?.background,
            border: "1px solid #0253A3",
            borderRadius: "5px",
            color: cssObject?.color,
          };
          break;
        case "very good":
          cssProperties = {
            background: cssObject?.background,
            border: "1px solid #0253A3",
            borderRadius: "5px",
            color: cssObject?.color,
          };
          break;
        case "good":
          cssProperties = {
            background: cssObject?.background,
            border: "1px solid #0253A3",
            borderRadius: "5px",
            color: cssObject?.color,
          };
          break;
        case "satisfactory":
          cssProperties = {
            background: cssObject?.background,
            border: "1px solid rgba(220, 38, 38, 0.66)",
            borderRadius: "5px",
            color: cssObject?.color,
          };
          break;
        case "bad":
          cssProperties = {
            background: cssObject?.background,
            border: "1px solid rgba(220, 38, 38, 0.66)",
            borderRadius: "5px",
            color: cssObject?.color,
          };
          break;
      }
    } else {
      cssProperties = { color: "#0555A4" };
    }
    return cssProperties;
  };

  const ItemList = () => {
    const cardItems =
      props?.pageData?.options?.length > 0 ? props.pageData.options : [];
    return cardItems
      .map((items, index) => {
        const label = items?.label;
        const isSelected =
          feedbackData?.[`page${currentPage}`]?.value === items?.value;
        return (
          <Box
            key={index}
            sx={{
              cursor: "pointer",
              width: "100%",
              marginBottom: "15px",
              minHeight: "48px",
            }}
            onClick={(e) => handleClick(e)}
          >
            <Item
              elevation={2}
              id={items?.value}
              className="radioGroupItems"
              sx={
                isSelected
                  ? { border: "2px solid #0555A4", background: "#D6D3E9" }
                  : getCSS(label)
              }
            >
              <Typography
                id={items?.value}
                sx={{
                  fontFamily: "Raleway",
                  fontSize: "14px",
                  fontWeight: isSelected ? 800 : 600,
                  lineHeight: "16px",
                  color: isSelected ? "#0555A4" : "",
                  textDecoration: "none",
                  textTransform: "capitalize",
                }}
              >
                {label?.split("|")[0]}
              </Typography>
            </Item>
          </Box>
        );
      })
      .reverse();
  };

  const getIcon = (label) => {
    let icon = "";
    if (label?.includes("Captain")) {
      icon = DriverIcon;
    } else if (label?.includes("Car")) {
      icon = CarIcon;
    }
    return icon;
  };
  return (
    <Box className="singleSelectGroup">
      {currentPage === 1 && (
        <StyledBox>
          <Typography
            sx={{
              fontFamily: "Raleway",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "16px",
              color: "#737373",
              opacity: "66%",
            }}
          >
            {HomePageMsg}
          </Typography>
        </StyledBox>
      )}

      <StyledBox
        sx={{
          display: "flex",
          flexDirection: "row",
          textAlign: currentPage === 1 ? "center" : "left",
          padding: "0px 20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {currentPage !== 1 && currentPage !== 5 && (
          <div style={{ paddingRight: "16px" }}>
            <img
              src={getIcon(props?.pageData?.label)}
              alt="Car Taxi"
              style={{ maxWidth: "52px" }}
              loading="lazy"
            />
          </div>
        )}
        <div>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "georgia",
              fontStyle: "normal",
              fontSize: "20px",
              color: "#1F4D7A",
              opacity: "90%",
              fontWeight: 400,
            }}
          >
            {props?.pageData?.label}
          </Typography>
        </div>
      </StyledBox>
      <StyledBox
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          mt:2
        }}
      >
        {ItemList()}
      </StyledBox>
    </Box>
  );
}
