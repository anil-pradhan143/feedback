import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppProvider } from "./AppContext";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Feedback from "./Feedback";
import { InvalidQRCode } from "./InvalidQRCode";
import { Container } from "@mui/material";

import { Box } from "@mui/material";
import "./App.css";

const StyledCard = styled((props) => {
  const { expand, ...other } = props;
  return <Paper {...other} />;
})(() => ({
  outline: "0px",
  textAlign: "center",
  padding: "0px 24px",
  boxShadow: "none",
  gap: "10px",
  border: "4px solid #34248F",
  borderRadius: "10px",
  maxWidth: "400px",
  position: "absolute",
  top: "10px",
  left: "10px",
  right: "10px",
  bottom: "10px",
  overflow: "auto",
  margin: "auto",
}));

const App = () => {
  return (
    <AppProvider>
      <StyledCard variant="outlined" className="root">
        <Router>
          <Switch>
            <Route exact path="/voc" component={Feedback} />
            <Route exact path="/404" component={InvalidQRCode} />
          </Switch>
        </Router>
      </StyledCard>
    </AppProvider>
  );
};
export default App;
