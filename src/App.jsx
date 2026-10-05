import { Outlet, useLocation } from "react-router-dom";
import NavbarBlock from "@/components/navbar/navbar";
import MobileBottomNav from "@/components/mobile-bottom-nav/MobileBottomNav";
import { Footer } from "./components/footer/footer";
import { ThemeProvider } from "./utils/theme-provider";
import ScrollToTop from "./utils/ScrollToTop"; // Import the ScrollToTop component

const HIDE_CHROME_PATHS = ["/login", "/signup", "/forgot-password"];

function App() {
  const location = useLocation();
  const hideChrome = HIDE_CHROME_PATHS.includes(location.pathname);

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
