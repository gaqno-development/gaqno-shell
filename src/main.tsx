import React from "react";
import ReactDOM from "react-dom/client";
import { installGlobalErrorHandler } from "@/lib/globalErrorHandler";
import { ensureFederationRemotesPatched } from "@/lib/patchFederationRemotes";
import App from "./App";
import "./styles/index.css";
import "./styles/sidebar-theme.css";

if ("serviceWorker" in navigator) {
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!reloading) {
      reloading = true;
      window.location.reload();
    }
  });
}

installGlobalErrorHandler();
ensureFederationRemotesPatched();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
