import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import { Checkbox, FormControlLabel } from '@mui/material';
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
  const [checkboxState, setCheckboxState] = useState(true);
  const [lastCheckBox , setLastCheckBox] = useState(false)

  const { selectedItems } = useContext(AppContext)
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
  }

  const handleChange = (event,val) => {
    if (event?.target?.value === "other" && event.target.checked) {
      let get = document.getElementsByName('check');
      for(var i=0; i<get.length; i++) {
      get[i].checked = false;
}
    }
    else{
    setCheckboxState(event.target.checked);}
    console.log("current check", event?.target?.value);
    if(val===last){
      setLastCheckBox(true)
      setCheckboxState(false)
    }else{
      setCheckboxState(true)
    }
  };

  const ItemList = () => {
    const multiSelectItems =
      props?.pageData?.options?.length > 0 ? props?.pageData?.options : [];
    return multiSelectItems.map((items, index) => {
      return (
        <Box sx={{
          display: 'flex', flexDirection: 'row', textAlign: "center",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <FormControlLabel
            control={<Checkbox checked={index === multiSelectItems?.length - 1 ? lastCheckBox :  checkboxState[index]} onChange={(evt)=>handleChange(evt,index=== multiSelectItems?.length-1 && 'last')} value={index <= 3 ? `checkbox${index + 1}` : "other"} name={index <= 3 ? "check" : "other"} />}
          />
          <Item
            elevation={2}
            id={`op${index + 1}`}
            onClick={() => handleOnChange(index + 1, items?.label)}
          >
            <p className="multiSelect-label" id={items?.label}>
              {/* {items?.label} */}
              SATISFACTORY
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
