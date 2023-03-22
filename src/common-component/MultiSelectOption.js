import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import { Checkbox, FormControlLabel } from "@mui/material";
import { AppContext } from "../AppContext";
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
  padding: "10%",
  minWidth: "150px",
}));

export default function MultiSelectOption(props) {
  console.log("props",props)
  const [showInputBox, setShowInputBox] = useState(false);
  const [checkBoxState, setCheckboxState] = useState(props?.pageData?.options);
  const { selectedItems } = useContext(AppContext);

  const handleNext = (e) => {
    e.preventDefault();
    props.handleNext(selectedItems.join());
  };

  const handlePrev = (e) => {
    e.preventDefault();
    props.handlePrev();
  };

  const handleOnChange = (itemLength, id, label) => {
    let newArr = [...checkBoxState];

    if (label?.toLowerCase() === "others") {
      for (var i = 0; i < itemLength; i++) {
        newArr[i].checked = false;
        newArr[id - i]?.checked ? selectedItems.push(label.toString().trim()):
        selectedItems.splice(selectedItems.indexOf(label), 1);
      }
      newArr[itemLength - 1].checked = !newArr[itemLength - 1].checked;
      newArr[id - 1]?.checked ? selectedItems.push(label.toString().trim()): selectedItems.splice(selectedItems.indexOf(label), 1);;
      setShowInputBox(!showInputBox);
    } else {
      setShowInputBox(false);
      newArr[itemLength-1].checked = false;
      newArr[id - 1].checked = !newArr[id - 1].checked;
      newArr[id - 1].checked ? selectedItems.push(label.toString().trim()):
      selectedItems.splice(selectedItems.indexOf(label), 1);
    }

    setCheckboxState(newArr);
  };

  const toggle_element = (element_id, label) => {
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
  };

  const ItemList = () => {
    console.log("checkBoxState",checkBoxState)
    return checkBoxState?.map((items, index) => {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={(event) =>
            handleOnChange(
              checkBoxState?.length,
              index + 1,
              items?.label
            )
          }
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={items?.checked}
                value={index}
                name={
                  index < checkBoxState?.length - 1
                    ? `checkbox${index + 1}`
                    : "other"
                }
              />
            }
          />
          <Item elevation={2} id={`op${index + 1}`}>
            <p className="multiSelect-label" id={items?.label}>
              {items?.label}
            </p>
          </Item>
        </Box>
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
