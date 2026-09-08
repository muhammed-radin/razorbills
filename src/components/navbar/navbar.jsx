import { Button } from "@/components/ui/button";
import { Logo } from "../logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { SunIcon, MoonIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/utils/theme-provider";
import AvatarMenu from "../avatar-menu";
import LanguageSwitcher from "../language-switcher";
import { useTranslation } from "react-i18next";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";

const NavbarBlock = () => {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation();

  const { data, isPending, error } = useSession();
  const user = data?.user;

  return (
    <nav className="h-16 bg-background border-b sticky top-0 z-50 w-full">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Menu */}
          <NavMenu className="hidden lg:block" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* theme button */}
          <Button
            size="icon"
            variant="outline"
            aria-label={t("nav.toggleTheme")}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="max-[330px]:hidden"
          >
            {theme === "light" ? (
              <MoonIcon className="h-4 w-4" />
            ) : (
              <SunIcon className="h-4 w-4" />
            )}
          </Button>

          {/* avatar or auth buttons */}
          {isPending ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <AvatarMenu
              name={user.name}
              img={user.profilePicture}
              user={user}
              size={40}
              decrypted={true}
            />
          ) : (
            <>
              <Link to="/login" className="cursor-pointer">
                <Button variant="outline" className="hidden lg:inline-flex">
                  {t("nav.signIn")}
                </Button>
              </Link>
              <Link to="/signup" className="cursor-pointer">
                <Button>{t("nav.signUp")}</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarBlock;
