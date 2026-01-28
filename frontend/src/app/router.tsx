import { createBrowserRouter } from "react-router-dom";

import { ProducerLayout } from "@/components/layout/ProducerLayout";

import ProducerSubmissionsPage from "@/pages/producer/ProducerSubmissionsPage";
import ProducerTracksPage from "@/pages/producer/ProducerTracksPage";
import ProducerProfilePage from "@/pages/producer/ProducerProfilePage";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/producer",
    element: <ProducerLayout />,
    children: [
      {
        index: true,
        element: <ProducerSubmissionsPage />,
      },
      {
        path: "submissions",
        element: <ProducerSubmissionsPage />,
      },
      {
        path: "tracks",
        element: <ProducerTracksPage />,
      },
      {
        path: "profile",
        element: <ProducerProfilePage />,
      },
    ],
  },
  {
    path: "/",
    element: <LoginPage />,
  },
]);