import React from "react";
import Login from "./pages/login";

const routes = [
  {
    path: "/",
    element: <div>Home</div>,
  },
  {
    path: "login",
    element: <Login />
  },

]

export default routes;