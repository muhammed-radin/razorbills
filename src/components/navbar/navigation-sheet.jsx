import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "../logo";
import { NavMenu } from "./nav-menu";
import LanguageSwitcher from "../language-switcher";
import { useTranslation } from "react-i18next";

export const NavigationSheet = () => {
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open Navigation Menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="px-6 py-4 flex flex-col justify-between">
        <div>
          <Logo />
          <NavMenu orientation="vertical" className="mt-6 [&>div]:h-full" />
        </div>
        <div className="pt-6 border-t">
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            {t("nav.toggleLanguage")}
          </p>
          <LanguageSwitcher variant="buttons" className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
};
