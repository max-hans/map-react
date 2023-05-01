import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./App";
import Map from "./routes/map";
import "./index.css";
import MapDev from "./routes/map/dev";
import Title from "./routes/data/title";
import ProjectScreen from "./routes/data/project";
import SocketAdapter from "./components/SocketAdapter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },

  {
    path: "/map",
    element: <Map />,
  },
  {
    path: "/dev",
    element: <MapDev />,
  },
  {
    path: "/data/title",
    element: <Title />,
  },
  {
    path: "/data/project",
    element: <ProjectScreen />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <main className="app w-screen h-screen bg-black overflow-hidden">
      <SocketAdapter topic="/" />
      <RouterProvider router={router} />
    </main>
  </React.StrictMode>
);
