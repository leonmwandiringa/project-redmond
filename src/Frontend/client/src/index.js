import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.jsx";
import AuthLayout from "layouts/Auth.jsx";

import "assets/css/black-dashboard-react.css";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";

const hist = createBrowserHistory();
//render
ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Route path="/auth" render={props => <AuthLayout {...props} />} />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
