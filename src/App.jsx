import { Outlet, useLocation } from 'react-router-dom';
import NavbarBlock from '@/components/navbar-02/navbar-02';


function App() {
const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);


  return (
    <>
      {!hideNavbar && <NavbarBlock />}
      <Outlet />
    </>
  );
}

export default App;