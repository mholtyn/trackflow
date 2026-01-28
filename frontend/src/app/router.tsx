import { createBrowserRouter } from "react-router-dom";

import { LabelLayout } from "@/components/layout/LabelLayout";
import LabelstaffProfilePage from "@/pages/label/LabelstaffProfilePage";
import LabelstaffWorkspaceSelectorPage from "@/pages/label/LabelstaffWorkspaceSelectorPage";
import LabelWorkspacePage from "@/pages/label/LabelWorkspacePage";
import LabelAdminSettingsPage from "@/pages/label/LabelAdminSettingsPage";

import { ProducerLayout } from "@/components/layout/ProducerLayout";
import ProducerSubmissionsPage from "@/pages/producer/ProducerSubmissionsPage";
import ProducerTracksPage from "@/pages/producer/ProducerTracksPage";
import ProducerProfilePage from "@/pages/producer/ProducerProfilePage";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/labelstaff",
    element: <LabelLayout />,
    children: [
      { path: "profile", element: <LabelstaffProfilePage /> },
      { path: "labels", element: <LabelstaffWorkspaceSelectorPage /> },
      { path: "labels/workspace", element: <LabelWorkspacePage /> }, // dev
      { path: "labels/:workspaceId", element: <LabelWorkspacePage /> },
      { path: "labels/workspace/admin", element: <LabelAdminSettingsPage /> }, // dev
      { path: "labels/:workspaceId/admin", element: <LabelAdminSettingsPage /> },
    ],
  },
  {
    path: "/producer",
    element: <ProducerLayout />,
    children: [
      { index: true, element: <ProducerSubmissionsPage /> },
      { path: "submissions", element: <ProducerSubmissionsPage /> },
      { path: "tracks", element: <ProducerTracksPage /> },
      { path: "profile", element: <ProducerProfilePage /> },
    ],
  },
  { path: "/", element: <LoginPage /> },
]);