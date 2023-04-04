import React, { useState, useContext } from "react";
import { Box, TextField, Typography, Paper } from "@mui/material";
import { AppContext } from "../AppContext";
import { styled } from "@mui/material/styles";
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
  background: "#F2F2F2",
  border: "1px solid rgba(45, 31, 122, 0.66)",
  borderRadius: "5px",
  marginBottom: "12px",
}));

export default function MultiSelectCardList(props) {
  const [checkBoxState, setCheckboxState] = useState(props?.pageData?.options);
  const {
    setFeedbackData,
    currentPage,
    selectedItems = [],
  } = useContext(AppContext);
  const [checked, setChecked] = useState([0]);
  const [freeText, setFreeText] = useState("");

  const handleToggle = (event, value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleOnChange = (itemLength, id, label) => {
    let pageItemList = [...checkBoxState];

    if (label?.toLowerCase() === "others") {
      let OtherInitialState = pageItemList[itemLength - 1].checked;
      for (let i = 0; i < itemLength; i++) {
        pageItemList[i].checked = false;
        selectedItems.splice(selectedItems.indexOf(label), 1);
      }
      pageItemList[itemLength - 1].checked = !OtherInitialState;
      pageItemList[id - 1]?.checked
        ? selectedItems.push(label.toString().trim())
        : selectedItems.splice(selectedItems.indexOf(label), 1);
    } else {
      pageItemList[itemLength - 1].checked = false;
      const index = selectedItems.indexOf("Others");
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
      pageItemList[id - 1].checked = !pageItemList[id - 1].checked;
      pageItemList[id - 1].checked
        ? selectedItems.push(label.toString().trim())
        : selectedItems.splice(selectedItems.indexOf(label), 1);
    }

    let currentPageData = {
      key: props?.pageData?.key,
      value: selectedItems.map((k) => k).join(","),
      extraParams: freeText,
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
          sx={{
            cursor: "pointer",
            width: "100%",
          }}
          onClick={() =>
            handleOnChange(checkBoxState?.length, index + 1, items?.value)
          }
          id={`itemBox${index}`}
        >
          <Item
            elevation={2}
            id={index + 1}
            className="radioGroupItems"
            onClick={(event) => handleToggle(event, index)}
            sx={
              items?.checked
                ? { border: "2px solid #362593", background: "#D6D3E9" }
                : {}
            }
          >
            <Box id={`checkbox${index}`}>
              <div className="round">
                <label
                  id={`lbl${index + 1}`}
                  style={
                    items?.checked
                      ? { backgroundColor: "#362593" }
                      : {
                          backgroundColor: "#D6D3E9",
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
                  color: items?.checked ? "#362593" : "#2D1F7A",
                  opacity: items?.checked ? "100%" : "70%",
                  textDecoration: "none",
                  textTransform: "capitalize",
                }}
              >
                {items?.label}
              </Typography>
              {items?.value?.toLowerCase()?.trim() === "others" &&
                items?.checked && (
                  <TextField
                    sx={{ backgroundColor: "#fff" }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onChange={(e) => setFreeText(e?.target?.value)}
                  ></TextField>
                )}
            </Box>
          </Item>
        </Box>
      );
    });
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
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "georgia",
            fontStyle: "normal",
            fontSize: "20px",
            color: "#2D1F7A",
            opacity: "90%",
            fontWeight: 400,
            lineHeight: "25px",
          }}
        >
          {props?.pageData?.label}
        </Typography>
      </Box>
      <Box sx={{ alignSelf: "flex-start", p: "5px", mt: "5px" }}>
        <Typography
          sx={{
            fontFamily: "Raleway",
            fontSize: "14px",
            color: "#2D1F7A",
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
