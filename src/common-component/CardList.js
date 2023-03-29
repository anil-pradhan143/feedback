import React, { useContext } from "react";
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

  const ItemList = () => {
    const cardItems =
      props?.pageData?.options?.length > 0 ? props?.pageData?.options : [];
    return cardItems?.map((items) => {
      const label = items?.label;
      const isSelected =
        feedbackData?.[`page${currentPage}`]?.value === items?.value;
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
            id={items?.value}
            className="radioGroupItems"
            sx={
              isSelected
                ? { border: "2px solid #362593", background: "#D6D3E9" }
                : {}
            }
          >
            <Typography
              id={items?.value}
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
    </Container>
  );
}
