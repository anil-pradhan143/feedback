import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppProvider } from "./AppContext";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Feedback from "./Feedback";
import { InvalidQRCode } from "./InvalidQRCode";
import "./App.css";

// const StyledCard = styled((props) => {
//   const { expand, ...other } = props;
//   return <Paper {...other} />;
// })(() => ({
//   outline: "0px",
//   textAlign: "center",
//   overflow: "auto",
//   margin: "auto",
//   border: 0,
// }));

const App = () => {
  return (
    <AppProvider>
      {/* <StyledCard variant="outlined" className="root"> */}
        <Router>
          <Switch>
            <Route exact path="/voc" component={Feedback} />
            <Route exact path="/404" component={InvalidQRCode} />
          </Switch>
        </Router>
      {/* </StyledCard> */}
    </AppProvider>
  );
};
export default App;
