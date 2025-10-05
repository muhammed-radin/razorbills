import { Outlet, useLocation } from 'react-router-dom';
import NavbarBlock from '@/components/navbar-02/navbar-02';
import { Footer } from './components/footer-02/footer';
import { ThemeProvider } from './utils/theme-provider';
import ScrollToTop from './utils/ScrollToTop'; // Import the ScrollToTop component

function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {!hideNavbar && <NavbarBlock />}
        <Outlet />
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;