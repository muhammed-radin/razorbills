import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import NavbarBlock from "@/components/navbar/navbar";
import MobileBottomNav from "@/components/mobile-bottom-nav/MobileBottomNav";
import { Footer } from "./components/footer/footer";
import { ThemeProvider } from "./utils/theme-provider";
import ScrollToTop from "./utils/ScrollToTop"; // Import the ScrollToTop component
import { useEffect, useRef, useState } from "react";
import { alert } from "./components/dialog-alert-provider";
import { toast } from "sonner";
import { LoaderScreen } from "./components/LoaderScreen";
import { api } from "./utils/api";
import { authClient } from "./lib/auth-client";

const HIDE_CHROME_PATHS = ["/login", "/signup", "/forgot-password"];
const GUEST_ACCESS_PATHS = [
  // main pages
  "/",
  "/search",
  "/categories",
  "/order-status",
  "/product/:id",

  // auth
  "/login",
  "/signup",
  "/forgot-password",

  // policy pages
  "/about",
  "/contact",
  "/return",
  "/shipping",
]; // Add paths that allow guest access

function App() {
  const location = useLocation();
  const hideChrome = HIDE_CHROME_PATHS.includes(location.pathname);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  const [searchParams] = useSearchParams();

  const isGuestAccess =
    GUEST_ACCESS_PATHS.includes(location.pathname) ||
    location.pathname.startsWith("/product/");
  const [isLoading, setIsLoading] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    async function validateIt() {
      const { data: session } = await api.getSession();
      const isSessionFound = !!session;
      if (isSessionFound) {
        setIsLoading(false);
        // User is authenticated, you can perform actions here if needed
      } else {
        if (HIDE_CHROME_PATHS.includes(location.pathname)) {
          setIsLoading(false);
          return; // Allow access to login, signup, and forgot-password pages
        }
        alert
          .confirm({
            title: "Authentication Required",
            description:
              "Please log in to access this page, or continue as a guest to explore limited features. Guest access requires cookies to be enabled.",
            buttonText: "Login",
            secondaryButtonText: "Continue as Guest",
          })
          .then(async (confirmed) => {
            if (confirmed) {
              // Redirect to login page
              navigate("/login");
            } else {
              // Continue as guest
              const { error } = await authClient.signIn.anonymous();
              if (error) {
                toast.error(
                  "Failed to sign in as guest. Please try again. Error: " +
                    error.message,
                );
              } else {
                toast.success("Signed in as guest.");
              }
              setTimeout(() => {
                setIsLoading(false);
                sessionStorage.removeItem("session"); // Clear any existing session data
                window.location.reload(); // Reload the page to reflect the guest session
              }, 1500);
            }
          });
      }

      if (!hasRun.current) {
        if (
          searchParams.get("auth") === "google" &&
          searchParams.get("success") === "true"
        ) {
          toast.success("Google Sign-In successful");
          sessionStorage.removeItem("session"); // Clear any existing session data
          hasRun.current = true;
          navigate("/"); // Navigate to the home page after successful Google sign-in
        }
      }

      if (
        isSessionFound &&
        isGuestAccess === false &&
        session?.user?.isAnonymous === true
      ) {
        navigate("/"); // Navigate to the current path if authenticated and not on a guest access page
      }
    }

    validateIt();
  }, [isGuestAccess, location.pathname, navigate]);

  return (
    <>
      <ScrollToTop />
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        {!hideChrome && <NavbarBlock />}
        {isLoading || isNavigating ? <LoaderScreen /> : <Outlet />}
        <Footer />
        {!hideChrome && <MobileBottomNav />}
      </ThemeProvider>
    </>
  );
}

export default App;
