import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./App";
import "./index.css";
import MapDev from "./routes/map/dev";
import Title from "./routes/data/title";
import ProjectScreen from "./routes/data/project";
import SocketAdapter from "./components/SocketAdapter";
import Controller from "./components/Contoller";
import Mockup from "./routes/map/mockup";
import FullMapView from "./routes/map/full";
import LegendScreen from "./routes/data/legendScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },

  {
    path: "/mockup",
    element: <Mockup />,
  },
  {
    path: "/dev",
    element: <MapDev />,
  },
  {
    path: "/full",
    element: <FullMapView />,
  },
  {
    path: "/data/title",
    element: <Title />,
  },
  {
    path: "/data/project",
    element: <ProjectScreen />,
  },
  {
    path: "/data/legend",
    element: <LegendScreen />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <main className="app w-screen h-screen bg-black overflow-hidden">
      <Controller />
      <SocketAdapter topic="/" />
      <RouterProvider router={router} />
    </main>
  </React.StrictMode>
);
