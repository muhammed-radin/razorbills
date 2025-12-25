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
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { clickToGProvider } from "@/utils/auth";
import { encrypt, encryptStrict } from "@/utils/crypt";
import axios from "axios";
import { api } from "@/utils/api";

import { toast } from "sonner"
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
});

const LoginPage = () => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    let { email, password } = data;
    let encryptedData =
    {
      email: email,
      password: encryptStrict(password),
    };

    SumbitForm(encryptedData);
  };

  const SumbitForm = (data) => {
    toast.promise(
      () =>
        new Promise((resolveui, rejectui) => {
          axios.post(api.base("/api/auth/login"), data)
            .then((response) => {
              console.log("user data from", response.data);
              resolveui("Login Successful");

              // // Store token in indexedDB
              localStorage.setItem("auth_token", encrypt(response.data.token));
              localStorage.setItem("user_data", encrypt(JSON.stringify(response.data.user)));

              navigate("/");
            })
            .catch((error) => {
              rejectui(error);
              console.error("There was an error!", error);

              setTimeout(() => {
                form.setValue('password', '');
              }, 1000);
            });
        }

        ),
      {
        loading: "Logging in...",
        success: (msg) => `${msg}`,
        error: (err) => `Login failed: ${err.response.data.message || err.message || "Unknown error"}`,
      }
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const pw = urlParams.get('pw');
    const signup = urlParams.get('signup');
    
    if (email && pw && signup) {
      form.setValue('email', decodeURIComponent(email));
      form.setValue('password', decodeURIComponent(pw));

      SumbitForm({
        email: decodeURIComponent(email),
        password: decodeURIComponent(pw)
      });
    } 

    
  }, []);


  const onUserGoogleSignIn = () => {
    clickToGProvider().then(({ user, token }) => {
      // extract uid, displayName, photoURL, email,  from user
      const { uid, displayName, photoURL, email } = user;
      let password = uid;
      // You can now use the user info and token as needed
      let encryptedData = {
        id: encrypt(uid),
        name: encrypt(displayName),
        avatar: encrypt(photoURL),
        email: email,
        provider: "google",
        password: encryptStrict(password), // Using uid as password for Google signups
      }

      SumbitForm(encryptedData);

    }).catch(({ errorCode, errorMessage, email, credential }) => {
      console.error("Error Code:", errorCode);
      console.error("Error Message:", errorMessage);
      console.error("Email:", email);
      console.error("Credential:", credential);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-muted">
      <div className="max-w-sm w-full flex flex-col items-center sm:border rounded-lg px-6 py-8 sm:shadow-sm/5 sm:bg-card">
        <Logo className="h-9 w-9" />
        <p className="mt-4 text-xl font-semibold tracking-tight">
          Log in to RazorBills
        </p>

        <Button className="mt-8 w-full gap-3" onClick={onUserGoogleSignIn}>
          <GoogleLogo />
          Continue with Google
        </Button>

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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
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
              Continue with Email
            </Button>
          </form>
        </Form>

        <div className="mt-5 space-y-5">
          <Link
            to="#"
            className="text-sm block underline text-muted-foreground text-center"
          >
            Forgot your password?
          </Link>
          <p className="text-sm text-center">
            Don&apos;t have an account?
            <Link to="/signup" className="ml-1 underline text-muted-foreground">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const GoogleLogo = () => (
  <svg
    width="1.2em"
    height="1.2em"
    id="icon-google"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0 align-sub text-inherit size-lg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M15.6823 8.18368C15.6823 7.63986 15.6382 7.0931 15.5442 6.55811H7.99829V9.63876H12.3194C12.1401 10.6323 11.564 11.5113 10.7203 12.0698V14.0687H13.2983C14.8122 12.6753 15.6823 10.6176 15.6823 8.18368Z"
        fill="#4285F4"
      ></path>
      <path
        d="M7.99812 16C10.1558 16 11.9753 15.2915 13.3011 14.0687L10.7231 12.0698C10.0058 12.5578 9.07988 12.8341 8.00106 12.8341C5.91398 12.8341 4.14436 11.426 3.50942 9.53296H0.849121V11.5936C2.2072 14.295 4.97332 16 7.99812 16Z"
        fill="#34A853"
      ></path>
      <path
        d="M3.50665 9.53295C3.17154 8.53938 3.17154 7.4635 3.50665 6.46993V4.4093H0.849292C-0.285376 6.66982 -0.285376 9.33306 0.849292 11.5936L3.50665 9.53295Z"
        fill="#FBBC04"
      ></path>
      <path
        d="M7.99812 3.16589C9.13867 3.14825 10.241 3.57743 11.067 4.36523L13.3511 2.0812C11.9048 0.723121 9.98526 -0.0235266 7.99812 -1.02057e-05C4.97332 -1.02057e-05 2.2072 1.70493 0.849121 4.40932L3.50648 6.46995C4.13848 4.57394 5.91104 3.16589 7.99812 3.16589Z"
        fill="#EA4335"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="15.6825" height="16" fill="white"></rect>
      </clipPath>
    </defs>
  </svg>
);

export default LoginPage;
