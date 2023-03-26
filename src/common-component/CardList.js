import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { AppContext } from "../AppContext";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { HomePageMsg } from "../Constants";

const Item = styled(Paper)(() => ({
  display: "flex",
  textAlign: "center",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "10px 20px",
  font: "Raleway",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "16px",
  gap: "10px",
  minWidth: "80%",
  background: "#F2F2F2",
  border: "1px solid rgba(45, 31, 122, 0.66)",
  borderRadius: "5px",
}));

const StyledBox = styled(Box)(() => ({
  marginTop: "24px",
}));

const FooterText = styled(Box)(() => ({
  marginTop: "60px",
}));

const FooterButtons = styled(Box)(() => ({
  marginTop: "60px",
}));

export default function CardList(props) {
  const {
    feedbackData,
    currentPage,
    selectedItems,
    footerButtons,
    setFooterButtons,
  } = useContext(AppContext);
  const [selectedValue, setSelectedValue] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    setSelectedValue(e?.target?.textContent);
  };

  const ItemList = () => {
    const cardItems =
      props?.pageData?.options?.length > 0 ? props?.pageData?.options : [];
    return cardItems?.map((items, index) => {
      let label = items?.label?.split("_")[5]?.split(":")[1];
      let isSelected = selectedValue?.toLowerCase() == label?.toLowerCase();
      return (
        <Box
          sx={{
            cursor: "pointer",
            width: "100%",
            marginBottom: "24px",
          }}
          onClick={(e) => handleClick(e)}
        >
          <Item
            elevation={2}
            id={`op${index + 1}`}
            className="radioGroupItems"
            sx={
              isSelected
                ? { border: "2px solid #362593", background: "#D6D3E9" }
                : {}
            }
          >
            <Typography
              id={label}
              sx={{
                fontFamily: "roboto",
                fontSize: "14px",
                fontWeight: isSelected ? 800 : 600,
                lineHeight: "16px",
                color: isSelected ? "#362593" : "#2D1F7A",
                opacity: isSelected ? "100%" : "70%",
                textDecoration: "none",
                textTransform: "capitalize",
              }}
            >
              {label}
            </Typography>
          </Item>
        </Box>
      );
    });
  };

  return (
    <Container className="multiSelectGroup">
      <StyledBox>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "16px",
            color: "#2D1F7A",
            opacity: "66%",
          }}
        >
          {HomePageMsg}
        </Typography>
      </StyledBox>
      <StyledBox>
        <Typography
          variant="h5"
          sx={{
            fontSize: "20px",
            color: "#2D1F7A",
            opacity: "90%",
            fontWeight: 400,
            lineHeight: "25px",
          }}
        >
          {props?.pageData?.label}
        </Typography>
      </StyledBox>
      <StyledBox
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {ItemList()}
      </StyledBox>

      <FooterText>
        <Typography
          sx={{
            color: "#2D1F7A",
            fontSize: "14px",
            fontWeight: 600,
            opacity: "70%",
          }}
        >
          Wow, thank you! Help us understand the parts of your experience that
          impressed you the most....
        </Typography>
      </FooterText>

      {footerButtons.length > 0 && (
        <FooterButtons>
          {footerButtons.map((button) => {
            let currrentButton = button?.toLowerCase();
            return (
              <Paper
                elevation={2}
                id={button}
                className="radioGroupItems"
                sx={{
                  padding: "10px 20px",
                  font: "Raleway",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "16px",
                  gap: "10px",
                  minWidth: "80%",
                  background: currrentButton === "prev" ? "#FFFFFF" : "#34248F",

                  border: "1px solid rgba(45, 31, 122, 0.66)",
                  borderRadius: "5px",
                  marginBottom: "12px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "roboto",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "16px",
                    color: "#2D1F7A",
                    color: currrentButton === "prev" ? "#2D1F7A" : "#FFFFFF",
                    opacity: currrentButton === "prev" ? "70%" : "100%",
                    textDecoration: "none",
                    textTransform: "capitalize",
                  }}
                >
                  {button}
                </Typography>
              </Paper>
            );
          })}
        </FooterButtons>
      )}
    </Container>
  );
}
