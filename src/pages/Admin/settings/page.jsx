import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Shield,
  Palette,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Save,
  Loader2,
  Camera,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useTheme } from "@/utils/theme-provider";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Profile Form State
  const [profile, setProfile] = useState({
    fullName: "Admin Administrator",
    email: "admin@razorbills.com",
    phone: "+91 9876543210",
    avatar: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Handle Profile Save
  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      toast.success(t("adminSettings.profileUpdated"));
    }, 800);
  };

  // Handle Password Change
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = t("adminSettings.currentPasswordRequired");
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = t("adminSettings.newPasswordMinLength");
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = t("adminSettings.newPasswordMinLength");
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = t("adminSettings.passwordMismatch");
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setIsSavingPassword(true);

    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success(t("adminSettings.passwordChangedSuccess"));
    }, 800);
  };

  // Handle Logout
  const handleLogout = () => {
    toast.info("Logged out of Admin session");
    navigate("/auth");
  };

  // Handle Deactivate Account
  const handleDeactivate = () => {
    toast.success(t("adminSettings.accountDeactivatedSuccess"));
    navigate("/auth");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
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

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto h-auto p-1 gap-1">
          <TabsTrigger value="profile" className="gap-2 py-2">
            <User className="w-4 h-4" />
            {t("adminSettings.profileTab")}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 py-2">
            <Shield className="w-4 h-4" />
            {t("adminSettings.securityTab")}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2 py-2">
            <Palette className="w-4 h-4" />
            {t("adminSettings.appearanceTab")}
          </TabsTrigger>
          <TabsTrigger value="danger" className="gap-2 py-2 text-destructive data-[state=active]:text-destructive">
            <AlertTriangle className="w-4 h-4" />
            {t("adminSettings.dangerZoneTab")}
          </TabsTrigger>
        </TabsList>

        {/* 1. Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <form onSubmit={handleProfileSave}>
              <CardHeader>
                <CardTitle>{t("adminSettings.profileInfo")}</CardTitle>
                <CardDescription>
                  {t("adminSettings.profileInfoDesc")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                      {profile.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">
                      {t("adminSettings.avatar")}
                    </Label>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => toast.info("Avatar upload is ready in this MVP.")}
                      >
                        <Camera className="w-4 h-4" />
                        {t("adminSettings.uploadAvatar")}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t("adminSettings.fullName")}</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                      placeholder={t("adminSettings.fullNamePlaceholder")}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("adminSettings.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      placeholder={t("adminSettings.emailPlaceholder")}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("adminSettings.phone")}</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      placeholder={t("adminSettings.phonePlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("adminSettings.role")}</Label>
                    <Input
                      value={t("adminSettings.superAdmin")}
                      disabled
                      className="bg-muted text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end border-t pt-4">
                <Button type="submit" disabled={isSavingProfile} className="gap-2">
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("adminSettings.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {t("adminSettings.saveChanges")}
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* 2. Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password Card */}
          <Card>
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  {t("adminSettings.changePassword")}
                </CardTitle>
                <CardDescription>
                  {t("adminSettings.changePasswordDesc")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 max-w-lg">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    {t("adminSettings.currentPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder={t("adminSettings.currentPasswordPlaceholder")}
                      className={passwordErrors.currentPassword ? "border-destructive pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-xs text-destructive">
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">
                    {t("adminSettings.newPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder={t("adminSettings.newPasswordPlaceholder")}
                      className={passwordErrors.newPassword ? "border-destructive pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-xs text-destructive">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t("adminSettings.confirmNewPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder={t("adminSettings.confirmNewPasswordPlaceholder")}
                      className={passwordErrors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <Button
                  type="submit"
                  disabled={isSavingPassword}
                  className="gap-2"
                >
                  {isSavingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("adminSettings.updatingPassword")}
                    </>
                  ) : (
                    t("adminSettings.updatePassword")
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Session Security Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("adminSettings.securityActions")}</CardTitle>
              <CardDescription>
                {t("adminSettings.securityActionsDesc")}
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
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t("adminSettings.logout")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                {t("adminSettings.appearance")}
              </CardTitle>
              <CardDescription>
                {t("adminSettings.appearanceDesc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Label>{t("adminSettings.theme")}</Label>
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
                  <Sun className="w-8 h-8 mb-2" />
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
                  <Moon className="w-8 h-8 mb-2" />
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
                  <Laptop className="w-8 h-8 mb-2" />
                  <span className="font-semibold text-sm">
                    {t("adminSettings.system")}
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Danger Zone Tab */}
        <TabsContent value="danger" className="space-y-6">
          <Card className="border-destructive/40 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {t("adminSettings.dangerZone")}
              </CardTitle>
              <CardDescription>
                {t("adminSettings.dangerZoneDesc")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-destructive/20 bg-background">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {t("adminSettings.deactivateAccount")}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                    {t("adminSettings.deactivateAccountDesc")}
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="shrink-0">
                      {t("adminSettings.deleteAccount")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("adminSettings.deleteDialogTitle")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("adminSettings.deleteDialogDesc")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t("adminSettings.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeactivate}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t("adminSettings.confirmDelete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
