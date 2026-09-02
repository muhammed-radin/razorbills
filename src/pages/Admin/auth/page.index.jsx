import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Outlet, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/utils/theme-provider";

import { StrictMode, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session && session.user) {
        if (session.user.role !== "admin") {
          navigate("/");
          return;
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        navigate("/");
      }
    });
  }, []);

  return (
    <StrictMode>
      <ThemeProvider>
        {isAuthenticated ? (
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
