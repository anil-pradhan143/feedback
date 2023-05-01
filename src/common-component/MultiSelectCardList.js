import React, { useState, useContext } from "react";
import { Box, TextField, Typography, Paper } from "@mui/material";
import { AppContext } from "../AppContext";
import { styled } from "@mui/material/styles";
import DriverIcon from "../assets/driver_icon.svg";
import CarIcon from "../assets/car_right.svg";
import "./CustomCheckbox.css";

const Item = styled(Paper)(() => ({
  display: "flex",
  flexDirection: "row",
  textAlign: "left",
  alignItems: "center",
  padding: "10px 10px",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "16px",
  gap: "10px",
  Width: "100%",
  background: "rgba(242, 242, 242, 0.66)",
  border: "1px solid #0555A4",
  borderRadius: "5px",
  marginBottom: "12px",
  boxShadow: "none",
}));

const StyledBox = styled(Box)(() => ({
  marginBottom: "24px",
}));

export default function MultiSelectCardList(props) {
  const [checkBoxState, setCheckboxState] = useState(props?.pageData?.options);
  const [selectedItems] = useState(props?.selectedItemList);
  const { feedbackData, setFeedbackData, currentPage } = useContext(AppContext);

  const handleOnChange = (id, label) => {
    let pageItemList = [...checkBoxState];

    pageItemList[id - 1].checked = !pageItemList[id - 1].checked;
    pageItemList[id - 1].checked
      ? selectedItems.push(label.toString().trim())
      : selectedItems.splice(selectedItems.indexOf(label), 1);

    let currentPageData = {
      key: props?.pageData?.key,
      value: selectedItems.map((k) => k).join(","),
      extraParams: feedbackData[`page${currentPage}`]?.extraParams ?? "",
    };

    setFeedbackData((prevData) => {
      return {
        ...prevData,
        [`page${currentPage}`]: currentPageData,
      };
    });
    setCheckboxState(pageItemList);
  };

  const ItemList = () => {
    return checkBoxState?.map((items, index) => {
      return (
        <Box
          key={index}
          sx={{
            cursor: "pointer",
            width: "100%",
          }}
          onClick={() => handleOnChange(index + 1, items?.value)}
          id={`itemBox${index}`}
        >
          <Item
            elevation={2}
            id={index + 1}
            className="radioGroupItems"
            sx={
              items?.checked
                ? {
                    border: "2px solid #0555A4",
                    background:
                      "linear-gradient(0deg, rgba(2, 103, 202, 0.1), rgba(2, 103, 202, 0.1)), rgba(242, 242, 242, 0.66)",
                  }
                : {}
            }
          >
            <Box id={`checkbox${index}`}>
              <div className="round">
                <label
                  id={`lbl${index + 1}`}
                  style={
                    items?.checked
                      ? { backgroundColor: "#0253A3" }
                      : {
                          backgroundColor: "rgba(2, 103, 202, 0.1)",
                          border: 0,
                          content: "none",
                        }
                  }
                />
              </div>
            </Box>

            <Box id={`labelBox${index}`}>
              <Typography
                className="multiSelect-label"
                id={items?.value}
                sx={{
                  fontFamily: "Raleway",
                  fontSize: "14px",
                  fontWeight: items?.checked ? 700 : 600,
                  lineHeight: "16px",
                  color: "#0555A4",
                  textDecoration: "none",
                  textTransform: "capitalize",
                }}
              >
                {items?.label}
              </Typography>
              {items?.value?.toLowerCase()?.trim() === "others" &&
                items?.checked && (
                  <TextField
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: "10px",
                      mt: 1,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    defaultValue={
                      feedbackData?.[`page${currentPage}`]?.extraParams ?? ""
                    }
                    onChange={(e) =>
                      setFeedbackData((prevData) => {
                        const val = e.target.value;
                        const scriptFilteredValue = val.replace(
                          "<script",
                          "O_o"
                        );
                        return {
                          ...prevData,
                          [`page${currentPage}`]: {
                            ...prevData?.[`page${currentPage}`],
                            extraParams: scriptFilteredValue,
                          },
                        };
                      })
                    }
                  ></TextField>
                )}
            </Box>
          </Item>
        </Box>
      );
    });
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
    <Box
      className="multiSelectGroup"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <StyledBox
        sx={{
          display: "flex",
          flexDirection: "row",
          maxHeight: "52px",
          textAlign: currentPage === 1 ? "center" : "left",
          padding: "0px 20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ paddingRight: "16px" }}>
          <img
            src={getIcon(props?.pageData?.label)}
            alt="Car Taxi"
            style={{ maxWidth: "52px" }}
            loading="lazy"
          />
        </div>
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
              lineHeight: "25px",
            }}
          >
            {props?.pageData?.label}
          </Typography>
        </div>
      </StyledBox>
      <Box sx={{ alignSelf: "flex-start", p: "5px", mt: "5px" }}>
        <Typography
          sx={{
            fontFamily: "Raleway",
            fontSize: "14px",
            color: "#1F4D7A",
            opacity: "90%",
            fontWeight: 400,
            lineHeight: "25px",
          }}
        >
          Select one or more:
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>{ItemList()}</Box>
    </Box>
  );
}
