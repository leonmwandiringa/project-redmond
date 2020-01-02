import Dashboard from "views/Dashboard.jsx";
import UserProfile from "views/UserProfile.jsx";
import Login from "views/Login.jsx";
import Register from "views/Register.jsx";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
    sidebar: true
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin",
    sidebar: false
  },
  {
    path: "/login",
    name: "Login",
    icon: "tim-icons icon-single-02",
    component: Login,
    layout: "/auth",
    sidebar: false
  },
  {
    path: "/register",
    name: "Register",
    icon: "tim-icons icon-single-02",
    component: Register,
    layout: "/auth",
    sidebar: false
  }
];
export default routes;
