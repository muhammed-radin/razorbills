import { Outlet, useLocation } from "react-router-dom";
import NavbarBlock from "@/components/navbar/navbar";
import { Footer } from "./components/footer/footer";
import { ThemeProvider } from "./utils/theme-provider";
import ScrollToTop from "./utils/ScrollToTop"; // Import the ScrollToTop component
import { Toaster } from "sonner";

function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup","forgot-password"].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        {!hideNavbar && <NavbarBlock />}
        <Outlet />
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
