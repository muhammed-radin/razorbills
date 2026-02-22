import { Separator } from "@/components/ui/separator";
import { Logo } from "../logo"; 
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
const footerSections = [
  {
    title: "Quick Links",
    links: [
      {
        title: "Home",
        href: "#",
      },
      {
        title: "Deals / Offers",
        href: "#",
      },
      {
        title: "Wishlist",
        href: "#",
      },
      {
        title: "Cart",
        href: "#",
      },
      {
        title: "Profile",
        href: "#",
      },

    ],
  },
  {
    title: "Customer Support",
    links: [
      {
        title: "Order Tracking",
        href: "#",
      },
      {
        title: "Return & Refunds",
        href: "#",
      },
      {
        title: "Shipping Info",
        href: "#",
      },
      {
        title: "Contact Us",
        href: "#",
      },

    ],
  },
  {
    title: "Company Info",
    links: [
      {
        title: "About Us",
        href: "/about",
      },
      {
        title: "Privacy Policy",
        href: "/privacy",
      },
      {
        title: "Terms & Conditions",
        href: "/terms",
      },
      
    ],
  },

];
export const Footer = () => {
  return (

      <footer className="border-t">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full xl:col-span-2">
              {/* Logo */}
             <Logo />
              <p className="mt-4 text-muted-foreground">
Your one-stop shop for the latest and greatest electronics.
              </p>
            </div>
            {footerSections.map(({ title, links }) => (
              <div key={title}>
                <h6 className="font-medium">{title}</h6>
                <ul className="mt-6 space-y-4">
                  {links.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        to={href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
           <span className="text-muted-foreground">
  &copy; {new Date().getFullYear()} RazorBills. All rights reserved.
</span>
           
          </div>
        </div>
    </footer>

        );
    };
