import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Users,
  Palette,
  LogOut,
  Sun,
  Moon,
  Laptop,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { useTheme } from "@/utils/theme-provider";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Logged-in admin info (View-only)
  const currentAdmin = {
    name: "Admin Administrator",
    email: "admin@razorbills.com",
    avatar: "",
    role: "Super Admin",
  };

  // Mock list of up to 10 admins
  const adminList = [
    {
      id: 1,
      name: "Admin Administrator",
      email: "admin@razorbills.com",
      avatar: "",
      role: "Super Admin",
      isCurrent: true,
    },
    {
      id: 2,
      name: "Mohammed Radheef",
      email: "radheef@razorbills.com",
      avatar: "",
      role: "Admin",
      isCurrent: false,
    },
    {
      id: 3,
      name: "Aisha Rahman",
      email: "aisha.r@razorbills.com",
      avatar: "",
      role: "Admin",
      isCurrent: false,
    },
    {
      id: 4,
      name: "Siddharth Menon",
      email: "siddharth.m@razorbills.com",
      avatar: "",
      role: "Admin",
      isCurrent: false,
    },
    {
      id: 5,
      name: "Ananya Nair",
      email: "ananya.n@razorbills.com",
      avatar: "",
      role: "Admin",
      isCurrent: false,
    },
  ];

  // Handle Logout
  const handleLogout = () => {
    toast.info("Logged out of Admin session");
    navigate("/auth");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Helmet>
        <title>{t("adminSettings.title")} - RazorBills</title>
      </Helmet>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t("adminSettings.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("adminSettings.subtitle")}
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Admin Profile (View-only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              {t("adminSettings.adminProfile")}
            </CardTitle>
            <CardDescription>
              {t("adminSettings.adminProfileDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 rounded-lg bg-muted/30 border">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={currentAdmin.avatar} alt={currentAdmin.name} />
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                  {getInitials(currentAdmin.name)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {currentAdmin.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    {currentAdmin.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {currentAdmin.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Admin List (Max 10) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              {t("adminSettings.admins")}
            </CardTitle>
            <CardDescription>
              {t("adminSettings.adminsDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y rounded-lg border bg-card">
              {adminList.slice(0, 10).map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={admin.avatar} alt={admin.name} />
                      <AvatarFallback className="font-semibold text-xs bg-muted">
                        {getInitials(admin.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {admin.name}
                        </span>
                        {admin.isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground block">
                        {admin.email}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded bg-muted">
                    {admin.role}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 3. Theme Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="w-5 h-5 text-primary" />
              {t("adminSettings.theme")}
            </CardTitle>
            <CardDescription>
              {t("adminSettings.themeDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Light */}
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center p-5 rounded-lg border-2 transition-all duration-200 ${
                  theme === "light"
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="w-7 h-7 mb-2" />
                <span className="font-semibold text-sm">
                  {t("adminSettings.light")}
                </span>
              </button>

              {/* Dark */}
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center p-5 rounded-lg border-2 transition-all duration-200 ${
                  theme === "dark"
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Moon className="w-7 h-7 mb-2" />
                <span className="font-semibold text-sm">
                  {t("adminSettings.dark")}
                </span>
              </button>

              {/* System */}
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center p-5 rounded-lg border-2 transition-all duration-200 ${
                  theme === "system"
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Laptop className="w-7 h-7 mb-2" />
                <span className="font-semibold text-sm">
                  {t("adminSettings.system")}
                </span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 4. Account / Logout */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("adminSettings.account")}
            </CardTitle>
            <CardDescription>
              {t("adminSettings.accountDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div>
                <h4 className="font-semibold text-sm">
                  {t("adminSettings.logout")}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t("adminSettings.logoutDesc")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                {t("adminSettings.logout")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
