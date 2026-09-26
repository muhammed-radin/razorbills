import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import { HashRouter as BrowserRouter } from "react-router-dom";
import Router from "./router/Router.jsx";
import { ThemeProvider } from "./utils/theme-provider.jsx";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { DialogAlertProvider } from "./components/dialog-alert-provider";
import { UserSessionProvider } from "./contexts/user-session-provider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <UserSessionProvider>
          <ThemeProvider>
            <DialogAlertProvider>
              <Toaster richColors position="top-right" theme="dark" />
              <Router />
            </DialogAlertProvider>
          </ThemeProvider>
        </UserSessionProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
