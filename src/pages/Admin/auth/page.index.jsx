import { Logo } from "@/components/logo";
import { Outlet, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/utils/theme-provider";

import { StrictMode, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { LoaderScreen } from "@/components/LoaderScreen";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   authClient.getSession().then((session) => {
  //     if (session && session.data.user) {
  //       if (session.data.user.role !== "admin") {
  //         console.log("User is not an admin. Redirecting to home page.");
  //         navigate("/");
  //         return;
  //       } else {
  //         setIsAuthenticated(true);
  //       }
  //     } else {
  //       console.log("No session found. Redirecting to home page.");
  //       console.log("Session:", session);
  //       setIsAuthenticated(false);
  //       navigate("/");
  //     }
  //   });
  // }, []);

  const { data, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (error) {
      navigate("/404");
      return;
    }
    if (!data || !data.user || data.user.role !== "admin") {
      navigate("/404");
    }
  }, [data]);

  return (
    <StrictMode>
      <ThemeProvider>
        {isPending ? (
          <LoaderScreen />
        ) : data && data.user && data.user?.role === "admin" ? (
          <Outlet />
        ) : (
          <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="flex flex-row mb-3">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-mono mb-1">
              AUTHENTICATION REQUIRED
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              Please authenticate to access the admin panel.
            </p>
          </div>
        )}
      </ThemeProvider>
    </StrictMode>
  );
};

export default AdminAuth;
