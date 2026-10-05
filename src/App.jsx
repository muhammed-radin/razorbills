import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavbarBlock from "@/components/navbar/navbar";
import MobileBottomNav from "@/components/mobile-bottom-nav/MobileBottomNav";
import { Footer } from "./components/footer/footer";
import { ThemeProvider } from "./utils/theme-provider";
import ScrollToTop from "./utils/ScrollToTop"; // Import the ScrollToTop component
import { useEffect } from "react";
import { useUserSession } from "./contexts/user-session-context";
import { alert } from "./components/dialog-alert-provider";
import { authClient } from "./lib/auth-client";
import { toast } from "sonner";

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
  const { data: session } = useUserSession(); // Access the user session context
  const isAtLeastGuest = session?.user && session?.user.isAnonymous === true;
  const navigate = useNavigate();
  const isGuestAccess =
    GUEST_ACCESS_PATHS.includes(location.pathname) ||
    location.pathname.startsWith("/product/");

  useEffect(() => {
    if (isAtLeastGuest) {
      // User is authenticated, you can perform actions here if needed
    } else {
      alert
        .confirm({
          title: "Authentication Required",
          description:
            "You need to be logged in to access this page or continue as a guest.",
          buttonText: "Login",
          secondaryButtonText: "Continue as Guest",
        })
        .then(async (confirmed) => {
          if (confirmed) {
            // Redirect to login page
            navigate("/login");
          } else {
            // Continue as guest
            const { data, error } = await authClient.signIn.anonymous();
            if (error) {
              toast.error("Failed to sign in as guest. Please try again.");
            } else {
              toast.success("Signed in as guest.");
              window.location.reload(); // Reload the page to reflect the guest session
            }
          }
        });
    }

    if (isAtLeastGuest && isGuestAccess === false) {
      navigate("/"); // Navigate to the current path if authenticated and not on a guest access page
    }
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        {!hideChrome && <NavbarBlock />}
        <Outlet />
        <Footer />
        {!hideChrome && <MobileBottomNav />}
      </ThemeProvider>
    </>
  );
}

export default App;
