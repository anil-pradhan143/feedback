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
  margin: "auto",
  justifyContent: "center",
  textAlign: "center",
  padding: "20px",
  boxShadow: "none",
  gap: "10px",
  border: "4px solid #34248F",
  borderRadius: "10px",
  minHeight: "800px",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  height: "auto",
}));

const App = () => {
  return (
    <AppProvider>
      <Container>
        <StyledCard variant="outlined">
          <Box>
            <Router>
              <Switch>
                <Route exact path="/voc" component={Feedback} />
                <Route exact path="/404" component={InvalidQRCode} />
              </Switch>
            </Router>
          </Box>
        </StyledCard>
      </Container>
    </AppProvider>
  );
};
export default App;
