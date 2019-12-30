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
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Auth",
    icon: "tim-icons icon-single-02",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Auth",
    icon: "tim-icons icon-single-02",
    component: Register,
    layout: "/auth"
  }
];
export default routes;
