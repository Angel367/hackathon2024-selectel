import Home from "./pages/Home.jsx";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Profile from "./pages/Profile.jsx";
import Protected from "./components/Protected.jsx";
import NotFound from "./pages/NotFound.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import DonorsTop100 from "./pages/DonorsTop100.jsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        path: "/users/:username",
        element: <Profile />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/top",
        element: <DonorsTop100 />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
