import React, { useContext } from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { AppContext } from "../AppContext";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  width: "100px",
  height: "100px",
}));

export default function HomeCard(props) {
  const { feedbackData, currentPage } = useContext(AppContext);

  const handleOnChange = (label) => {
    props.handleSubmit(label);
  };

  const ItemList = () => {
    const cardItems =
      props?.pageData?.options?.length > 0 ? props?.pageData?.options : [];
    return (
      <Grid container justifyContent="center" spacing={2}>
        {cardItems.map((items, index) => {
          return (
            <Grid key={index} item className="radioGroup">
              <Item
                elevation={2}
                id={`op${index + 1}`.toString()}
                onClick={() => handleOnChange(items?.value)}
                style={
                  (index + 1)?.toString() ===
                  feedbackData?.[`page${currentPage + 1}`]?.value
                    ? { backgroundColor: "#006ABE", color: "#fff" }
                    : {
                        backgroundColor: items?.label
                          ?.split("_")[3]
                          ?.split(":")[1],
                      }
                }
                className="radioGroupItems"
              >
                <div className="card-items">
                  <Typography id="card-value" key={items?.value}>
                    {items?.value}
                  </Typography>
                  <Typography id="card-label" key={items?.label}>
                    {items?.label?.split("_")[5]?.split(":")[1]}
                  </Typography>
                </div>
              </Item>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <>
      <Typography variant="h5" sx={{ mt: 3 }}>
        {props?.pageData?.label}
      </Typography>
      <Grid sx={{ flexGrow: 1, mt: 2 }} container spacing={2}>
        <Grid item xs={12}>
          {ItemList()}
        </Grid>
      </Grid>
    </>
  );
}
