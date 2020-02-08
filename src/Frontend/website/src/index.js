import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.0.0";
import "assets/demo/demo.css";

import LandingPage from "views/LandingPage.jsx";
import ProfilePage from "views/ProfilePage.jsx";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route
        path="/home"
        render={props => <LandingPage {...props} />}
      />
      <Route
        path="/contact"
        render={props => <ProfilePage {...props} />}
      />
      <Redirect from="/" to="/home" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
