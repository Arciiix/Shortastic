import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./components/Home/Home";
import Summary from "./components/Summary/Summary";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/summary">
              <Summary />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
