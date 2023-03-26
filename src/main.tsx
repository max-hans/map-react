import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./App";
import Map from "./routes/map";
import "./index.css";
import MapDev from "./routes/map/dev";

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
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <main className="app w-screen h-screen bg-gray-800 overflow-hidden">
      <RouterProvider router={router} />
    </main>
  </React.StrictMode>
);
