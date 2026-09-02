import React from "react";
import { useTranslation } from "react-i18next";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "English", label: "EN", nativeName: "English" },
  { code: "ml", name: "Malayalam", label: "മല", nativeName: "മലയാളം" },
];

export function LanguageSwitcher({ variant = "dropdown", className, ...props }) {
  const { i18n, t } = useTranslation();

  const currentLang = i18n.language?.startsWith("ml") ? "ml" : "en";

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    try {
      localStorage.setItem("i18nextLng", langCode);
    } catch (e) {
      console.warn("Could not persist language to localStorage", e);
    }
  };

  if (variant === "select") {
    return (
      <Select value={currentLang} onValueChange={handleLanguageChange}>
        <SelectTrigger className={cn("w-full", className)} {...props}>
          <SelectValue placeholder={t("nav.toggleLanguage")} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.nativeName}</span>
                {lang.code !== "en" && (
                  <span className="text-xs text-muted-foreground">({lang.name})</span>
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (variant === "buttons") {
    return (
      <div className={cn("flex items-center gap-1 p-1 bg-muted rounded-lg", className)} {...props}>
        {languages.map((lang) => (
          <Button
            key={lang.code}
            type="button"
            variant={currentLang === lang.code ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs font-medium h-8"
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.nativeName}
          </Button>
        ))}
      </div>
    );
  }

  // Default: Dropdown
  const activeLanguageObj = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-1.5 px-2.5 h-9 font-medium text-xs rounded-full", className)}
          aria-label={t("nav.toggleLanguage")}
          {...props}
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span>{activeLanguageObj.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center justify-between cursor-pointer text-xs py-2"
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className="font-medium">{lang.nativeName}</span>
            {currentLang === lang.code && <Check className="h-4 w-4 text-primary ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
