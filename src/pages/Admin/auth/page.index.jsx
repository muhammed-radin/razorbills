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
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { decryptStrict, encrypt, encryptStrict } from "@/utils/crypt";
import { ThemeProvider } from "@/utils/theme-provider";
import axios from "axios";
import { api } from "@/utils/api";

import { toast, Toaster } from "sonner";
import { StrictMode, useEffect, useState } from "react";
import Cookies from "js-cookie";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    let { username, password } = data;
    let encryptedData = {
      username: encryptStrict(username),
      password: encryptStrict(password),
    };

    SumbitForm(encryptedData);
  };

  useEffect(() => {
    var token = Cookies.get("adminToken");

    if (token) {
      token = decryptStrict(token);

      toast.success("Session found, logging in...");
      api.client
        .post("/api/admin-auth/validate", { token })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Login Successful");
            setIsAuthenticated(true);
            return;
          }
        })
        .catch((error) => {
          toast.error(
            "Login Failed: " + error.response?.data?.message || error.message,
          );
          Cookies.remove("adminToken");
          return;
        });
      return;
    }
  }, []);

  const SumbitForm = (data) => {
    toast.promise(
      () =>
        new Promise((resolveui, rejectui) => {
          if (!data.username || !data.password) {
            rejectui("Username and password are required");
            return;
          }

          api.client
            .post("/api/admin-auth", data)
            .then((response) => {
              if (response.status !== 200) {
                rejectui(response.data);
                return;
              }
              resolveui("Login Successful");

              // Store token in coockies
              Cookies.set("adminToken", encryptStrict(response.data.token), {
                expires: 1, // 1 day
                secure: false,
                sameSite: "lax",
              });

              setIsAuthenticated(true);
            })
            .catch((error) => {
              rejectui(error);
              console.error("There was an error!", error);

              setTimeout(() => {
                form.setValue("password", "");
              }, 1000);
            });
        }),
      {
        loading: "Logging in...",
        success: (msg) => `${msg}`,
        error: (err) =>
          `Login failed: ${(err.response && err.response.data.message) || err.message || "Unknown error"}`,
      },
    );
  };

  return (
    <StrictMode>
      <ThemeProvider>
        <Toaster position="top-right" theme="dark" richColors />
        {isAuthenticated ? (
          <Outlet />
        ) : (
          <div className="min-h-screen flex items-center justify-center sm:bg-muted">
            <div className="max-w-sm w-full flex flex-col items-center sm:border rounded-lg px-6 py-8 sm:shadow-sm/5 sm:bg-card">
              <Logo className="h-9 w-9" />
              <p className="mt-4 text-xl font-semibold tracking-tight">
                Log in to RazorBills Admin
              </p>

              <div className="my-7 w-full flex items-center justify-center overflow-hidden">
                <Separator />
                <span className="text-sm px-2">OR</span>
                <Separator />
              </div>

              <Form {...form}>
                <form
                  className="w-full space-y-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type="username"
                            placeholder="username"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-4 w-full">
                    Continue with username
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </ThemeProvider>
    </StrictMode>
  );
};

export default AdminAuth;
