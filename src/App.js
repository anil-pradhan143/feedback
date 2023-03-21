import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppProvider } from "./AppContext";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Feedback from "./Feedback";
import { InvalidQRCode } from "./InvalidQRCode";
import { Container } from "@mui/material";
import Nav from "./common-component/Nav";
import "./App.css";

const StyledCard = styled((props) => {
  const { expand, ...other } = props;
  return <Paper {...other} />;
})(() => ({
  outline: "0px",
  margin: "auto",
  justifyContent: "center",
  textAlign: "center",
  padding: "24px",
  boxShadow: "none",
}));

const App = () => {
  return (
    <AppProvider>
      <Container>
        <StyledCard variant="outlined" sx={{ maxWidth: "80%" }}>
          <Nav />

          <Router>
            <Switch>
              <Route exact path="/voc" component={Feedback} />
              <Route path="/voc/feedback" component={Feedback} />
              <Route exact path="/404" component={InvalidQRCode} />
            </Switch>
          </Router>
        </StyledCard>
      </Container>
    </AppProvider>
  );
};
export default App;
