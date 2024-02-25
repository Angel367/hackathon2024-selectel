import Home from "./pages/Home.jsx";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Profile from "./pages/Profile.jsx";
import Protected from "./components/Protected.jsx";
import NotFound from "./pages/NotFound.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import DonorsTop100 from "./pages/DonorsTop100.jsx";
import Menu from "./pages/Menu.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import DonorCard from "./pages/DonorCard.jsx";
import DonationList from "./pages/Donation/DonationList.jsx";
import Donation from "./pages/Donation/Donation.jsx";
import DonationCreate from "./pages/Donation/DonationCreate.jsx";
import PlanDonationList from "./pages/PlanDonation/PlanDonationList.jsx";
import PlanDonationCreate from "./pages/PlanDonation/PlanDonationCreate.jsx";
import PlanDonation from "./pages/PlanDonation/PlanDonation.jsx";
import SearchBloodStation from "./pages/SearchBloodStation.jsx";
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
        element: (
          <Protected>
            <Profile />
          </Protected>
        ),
      },
      {
        path: "/users/:username/donations",
        element: (
          <Protected>
            <DonationList />
          </Protected>
        ),
      },
      {
        path: "/users/:username/donations/create",
        element: (
          <Protected>
            <DonationCreate />
          </Protected>
        ),
      },
      {
        path: "/users/:username/donations/:id",
        element: (
          <Protected>
            <Donation />
          </Protected>
        ),
      },
        {
        path: "/users/:username/plan-donations",
        element: (
          <Protected>
            <PlanDonationList />
          </Protected>
        ),
      },
      {
        path: "/users/:username/plan-donations/:id/create",
        element: (
          <Protected>
            <PlanDonationCreate />
          </Protected>
        ),
      },
      {
        path: "/users/:username/plan-donations/:id",
        element: (
          <Protected>
            <PlanDonation />
          </Protected>
        ),
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
        path: "/blood_centers",
        element: <SearchBloodStation />,
      },
      {
        path: "/top",
        element: <DonorsTop100 />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/edit",
        element: (
          <Protected>
            <EditProfile />
          </Protected>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/donor-card",
        element: (
          <Protected>
            <DonorCard />
          </Protected>
        ),
      },
    ],
  },
]);
