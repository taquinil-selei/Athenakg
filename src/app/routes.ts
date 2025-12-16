import { createBrowserRouter } from "react-router";
import Root from "./Root";
import { CanvasWorkspace } from "./pages/CanvasWorkspace";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: CanvasWorkspace },
      { path: "*", Component: NotFound },
    ],
  },
]);