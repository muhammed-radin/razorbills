import { Button } from "@/components/ui/button";
import { Logo } from "../logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { SunIcon, MoonIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/utils/theme-provider";

const NavbarBlock = () => {
  const { setTheme, theme } = useTheme();

  return (
    <nav className="h-16 bg-background border-b sticky top-0 z-50 w-full">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
        </div>

        <div className="flex items-center gap-3">
          <Link to="./login" className="cursor-pointer">
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link to="./signup" className="cursor-pointer">
            <Button>Sign Up</Button>
          </Link>
          <Button size="icon" variant="outline" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            { theme === "light" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" /> }
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarBlock;
