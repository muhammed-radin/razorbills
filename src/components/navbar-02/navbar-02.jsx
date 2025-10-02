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
    <nav className="h-14 sm:h-16 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-8">
          <Logo />

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="./login" className="cursor-pointer hidden sm:inline-block">
            <Button variant="outline" size="sm" className="sm:size-default">
              Sign In
            </Button>
          </Link>
          <Link to="./signup" className="cursor-pointer">
            <Button size="sm" className="sm:size-default text-xs sm:text-sm">
              Sign Up
            </Button>
          </Link>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9 sm:h-10 sm:w-10"
          >
            {theme === "light" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
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
