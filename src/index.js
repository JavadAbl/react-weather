import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactWeather from "./ReactWeather";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ReactWeather />
  </StrictMode>
);
