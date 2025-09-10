import { Outlet, useLocation } from 'react-router-dom';
import NavbarBlock from '@/components/navbar-02/navbar-02';
import { Footer } from './components/footer-02/footer';

function App() {
const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);


  return (
    <>
      {!hideNavbar && <NavbarBlock />}
      <Outlet />
      <Footer/>
    </>
  );
}

export default App;