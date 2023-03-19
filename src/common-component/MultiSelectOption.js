import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import { AppContext } from "../AppContext";
import { useHistory } from "react-router-dom";
import { CardContent, Typography } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const Item = styled(Paper)(() => ({
  display: "flex",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "35px",
  fontWeight: "bold",
}));

export default function MultiSelectOption(props) {
  const [showInputBox, setShowInputBox] = useState(false);
  const history = useHistory();

  const { selectedItems } = useContext(AppContext);

  const handleNext = (e) => {
    e.preventDefault();
    props.handleNext(selectedItems.join());
  };

  const handlePrev = (e) => {
    e.preventDefault();
    props.handlePrev();
  };

  const handleOnChange = (id, label) => {
    toggle_element(`op${id}`, label);
    label?.toLowerCase() === "others"
      ? setShowInputBox(!showInputBox)
      : setShowInputBox(false);
  };

  function toggle_element(element_id, label) {
    var element = document.getElementById(element_id);
    if (element.style.backgroundColor !== "rgb(0, 106, 190)") {
      element.style.backgroundColor = "rgb(0, 106, 190)";
      element.style.color = "rgb(255, 255, 255)";
      selectedItems.push(label.toString().trim());
    } else {
      element.style.backgroundColor = "rgb(255, 255, 255)";
      element.style.color = "rgb(0, 0, 0)";
      selectedItems.splice(selectedItems.indexOf(label), 1);
    }
  }

  const ItemList = () => {
    const multiSelectItems =
      props?.pageData?.options?.length > 0 ? props?.pageData?.options : [];
    return multiSelectItems.map((items, index) => {
      return (
        <Item
          elevation={2}
          id={`op${index + 1}`}
          onClick={() => handleOnChange(index + 1, items?.label)}
        >
          <p className="multiSelect-label" id={items?.label}>
            {items?.label}
          </p>
        </Item>
      );
    });
  };

  return (
    <>
      <CardContent
        className="multiSelectGroup"
        sx={{
          padding: "30px 0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box>
          <Typography variant="h5">{props?.pageData?.label}</Typography>
        </Box>
        <Box
          sx={{
            display: "block",
            justifyContent: "center",
            "& > :not(style)": {
              m: 2,
              width: "200px",
              height: "auto",
              padding: "20px",
            },
          }}
        >
          {ItemList()}
        </Box>
        {showInputBox && (
          <Box>
            <TextField
              id="outlined-multiline-static"
              label=""
              multiline
              rows={4}
              defaultValue=""
              fullWidth
            />
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <button
          className="btnPrev"
          type="submit"
          onClick={(e) => {
            handlePrev(e);
          }}
        >
          Prev
        </button>
        <button
          className="btnNext"
          type="submit"
          onClick={(e) => {
            handleNext(e);
          }}
        >
          Next
        </button>
      </CardActions>
    </>
  );
}
