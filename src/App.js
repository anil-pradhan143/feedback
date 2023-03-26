import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppProvider } from "./AppContext";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Feedback from "./Feedback";
import { InvalidQRCode } from "./InvalidQRCode";
import { Container } from "@mui/material";
import CarTaxi from "../src/assets/cars-taxi.png";
import { Box, Typography } from "@mui/material";
import "./App.css";

const StyledCard = styled((props) => {
  const { expand, ...other } = props;
  return <Paper {...other} />;
})(() => ({
  outline: "0px",
  margin: "auto",
  justifyContent: "center",
  textAlign: "center",
  padding: "20px",
  boxShadow: "none",
  gap: "10px",
  border: "4px solid #34248F",
  borderRadius: "10px",
  minHeight: "764px",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
}));

const CtTaxiNumber = styled(Box)(() => ({
  color: "#2D1F7A",
  opacity: "66%",
  fontSize: "11px",
  lineHeight: "14px",
}));

const App = () => {
  return (
    <AppProvider>
      <Container>
        <StyledCard variant="outlined">
          <Box>
            <img src={CarTaxi} alt="Car Taxi" loading="lazy" />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Router>
              <Switch>
                <Route exact path="/voc" component={Feedback} />
                <Route exact path="/404" component={InvalidQRCode} />
              </Switch>
            </Router>
          </Box>

          <CtTaxiNumber>
            <Typography>CT-3422</Typography>
          </CtTaxiNumber>
        </StyledCard>
      </Container>
    </AppProvider>
  );
};
export default App;
