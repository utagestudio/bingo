import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { installGoogleAnalytics } from "./lib/analytics";
import "./styles.css";

installGoogleAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
