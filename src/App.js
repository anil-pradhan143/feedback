import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppProvider } from "./AppContext";
import Feedback from "./Feedback";
import { InvalidQRCode } from "./InvalidQRCode";
import "./App.css";


const App = () => {
  return (
    <AppProvider>
        <Router>
          <Switch>
            <Route exact path="/voc" component={Feedback} />
            <Route exact path="/404" component={InvalidQRCode} />
          </Switch>
        </Router>
    </AppProvider>
  );
};
export default App;
