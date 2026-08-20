import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter as BrowserRouter } from "react-router-dom";
import Router from "./router/Router.jsx";
import { ThemeProvider } from "./utils/theme-provider.jsx";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { DialogAlertProvider } from "./components/dialog-alert-provider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <DialogAlertProvider>
            <Toaster richColors position="top-right" theme="dark" />
            <Router />
          </DialogAlertProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
