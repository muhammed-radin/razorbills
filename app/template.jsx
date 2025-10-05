'use client';

import { usePathname } from 'next/navigation';
import NavbarBlock from '@/src/components/navbar-02/navbar-02';
import { Footer } from '@/src/components/footer-02/footer';

export default function Template({ children }) {
  const pathname = usePathname();
  const hideNavbar = ["/login", "/signup"].includes(pathname);

  return (
    <>
      {!hideNavbar && <NavbarBlock />}
      {children}
      <Footer />
    </>
  );
}
