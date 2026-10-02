import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Shield,
  Palette,
  MapPin,
  Settings,
  Camera,
  Save,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Key,
  LogOut,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { settingsApi } from "@/services/shop";
import { decrypt, encrypt } from "@/utils/crypt";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";

const phoneErrorMessage =
  "Enter a valid international number, for example +91 1234567890";
const nameErrorMessage = "Name must be between 4 and 20 characters";

const nameSchema = z
  .string()
  .trim()
  .min(4, nameErrorMessage)
  .max(20, nameErrorMessage);

const phoneSchema = z.string().refine((value) => {
  if (value === "") return true;
  const phoneNumber = parsePhoneNumberFromString(value);
  return Boolean(
    phoneNumber?.isValid() &&
    /^\+\d{1,3} \d+$/.test(value) &&
    !/[\s-]/.test(phoneNumber.nationalNumber),
  );
}, phoneErrorMessage);

const normalizePhoneNumber = (value) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  const digitsOnly = trimmedValue.replace(/\D/g, "");
  if (!digitsOnly) return trimmedValue.startsWith("+") ? "+" : "";

  const cleanedValue = `+${digitsOnly}`;
  const phoneNumber = parsePhoneNumberFromString(cleanedValue);
  if (phoneNumber?.isValid()) {
    return `+${phoneNumber.countryCallingCode} ${phoneNumber.nationalNumber}`;
  }

  return cleanedValue;
};

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    language: "en",
    theme: "system",
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  });

  useEffect(() => {
    setMounted(true);
    setIsLoading(true);
    // Load profile from the session + preferences from the API
    api
      .getUser(false, true)
      .then((user) => {
        if (!user) return;
        setUserData((prev) => ({
          ...prev,
          name: decrypt(user.name ?? prev.name),
          email: user.email ?? prev.email,
          phone: normalizePhoneNumber(decrypt(user.phoneNumber ?? prev.phone)),
          avatar: user.image ?? prev.avatar,
        }));
        setIsLoading(false);
      })
      .catch(() => {});
    settingsApi
      .get()
      .then((prefs) => {
        const p = prefs?.prefrences ?? prefs ?? {};
        setUserData((prev) => ({
          ...prev,
          language: p.language ?? prev.language,
          pushNotifications:
            p.pushNotificationEnabled ?? prev.pushNotifications,
          emailNotifications:
            p.emailNotificationsEnabled ?? prev.emailNotifications,
          orderUpdates: p.notificationEnabled ?? prev.orderUpdates,
        }));
        if (p.language) i18n.changeLanguage(p.language).catch(() => {});
      })
      .catch(() => {});
  }, [i18n]);

  const handleSave = async () => {
    const nameValidation = nameSchema.safeParse(userData.name);
    if (!nameValidation.success) {
      const message =
        nameValidation.error.issues[0]?.message ?? nameErrorMessage;
      setNameError(message);
      toast.error(message);
      return;
    }
    const normalizedName = nameValidation.data;

    const phoneValidation = phoneSchema.safeParse(userData.phone);
    if (!phoneValidation.success) {
      const message =
        phoneValidation.error.issues[0]?.message ?? "Invalid phone number";
      setPhoneError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);
    try {
      await settingsApi.save({
        language: userData.language,
        notificationEnabled: userData.orderUpdates,
        pushNotificationEnabled: userData.pushNotifications,
        emailNotificationsEnabled: userData.emailNotifications,
      });
      await api.client.post("/api/users/profile", {
        name: encrypt(normalizedName),
        email: userData.email,
        phone: (userData.phone || "").trim() ? encrypt(userData.phone) : "",
        avatar: userData.avatar,
      });
      i18n.changeLanguage(userData.language).catch(() => {});
      toast.success(t("settings.saved", { defaultValue: "Settings saved" }));
    } catch {
      toast.error(
        t("common.error", { defaultValue: "Failed to save settings" }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div
          className={cn(
            "flex items-center gap-3 mb-8 transition-all duration-500",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("settings.title")}
            </h1>
            <p className="text-muted-foreground">{t("settings.subtitle")}</p>
          </div>
        </div>

        {/* Settings Tabs */}
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
          </>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList
              className={cn(
                "grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 transition-all duration-500 delay-100",
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("settings.profile")}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("settings.notifications")}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("settings.appearance")}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("settings.security")}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent
              value="profile"
              className={cn(
                "transition-all duration-500 delay-200",
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <div className="grid gap-6">
                {/* Avatar Section */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      {t("settings.profilePicture")}
                    </CardTitle>
                    <CardDescription>
                      {t("settings.uploadProfilePicture")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-6">
                      <div className="relative group">
                        <Avatar className="w-24 h-24 border-4 border-primary/20 transition-all duration-300 group-hover:border-primary/40">
                          {userData.avatar ? (
                            <AvatarImage
                              src={userData.avatar}
                              alt={userData.name}
                            />
                          ) : null}
                          <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                            {getInitials(userData.name)}
                          </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                          {userData.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {userData.email}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {userData.phone ||
                            t("settings.noPhoneNumber", {
                              defaultValue: "No phone number provided",
                            })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {t("settings.personalInfo")}
                    </CardTitle>
                    <CardDescription>
                      {t("settings.personalInfoDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("settings.fullName")}</Label>
                        <Input
                          id="name"
                          value={userData.name}
                          onChange={(e) => {
                            const name = e.target.value.trim();
                            const validation = nameSchema.safeParse(name);
                            setUserData({ ...userData, name });
                            setNameError(
                              validation.success
                                ? ""
                                : (validation.error.issues[0]?.message ??
                                    nameErrorMessage),
                            );
                          }}
                          aria-invalid={Boolean(nameError)}
                          className={cn(
                            "transition-all duration-300 focus:ring-2 focus:ring-primary/20",
                            nameError &&
                              "border-destructive focus-visible:ring-destructive",
                          )}
                        />
                        {nameError && (
                          <p className="text-sm text-destructive" role="alert">
                            {nameError}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {t("settings.emailAddress")}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            disabled={true}
                            className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {t("settings.phoneNumber")}
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            value={userData.phone}
                            onChange={(e) =>
                              (() => {
                                const phone = normalizePhoneNumber(
                                  e.target.value,
                                );
                                const validation = phoneSchema.safeParse(phone);
                                setUserData({ ...userData, phone });
                                setPhoneError(
                                  validation.success
                                    ? ""
                                    : (validation.error.issues[0]?.message ??
                                        phoneErrorMessage),
                                );
                              })()
                            }
                            placeholder={t("settings.phoneNumberPlaceholder", {
                              defaultValue: "Enter your phone number",
                            })}
                            aria-invalid={Boolean(phoneError)}
                            className={cn(
                              "pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20",
                              phoneError &&
                                "border-destructive focus-visible:ring-destructive",
                            )}
                          />
                        </div>
                        {phoneError && (
                          <p className="text-sm text-destructive" role="alert">
                            {phoneError}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">
                          {t("settings.language")}
                        </Label>
                        <Select
                          value={userData.language}
                          onValueChange={(value) =>
                            setUserData({ ...userData, language: value })
                          }
                        >
                          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                            <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue
                              placeholder={t("settings.selectLanguage")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ml">Malayalam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="transition-all duration-300 hover:shadow-lg"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Saving...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            {t("settings.saveSettings", {
                              defaultValue: "Save Settings",
                            })}
                          </span>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Book Link */}
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <Link to="/addressbook">
                    <CardContent className="flex items-center justify-between py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {t("settings.addressBook")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.manageAddresses")}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
                    </CardContent>
                  </Link>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent
              value="notifications"
              className={cn(
                "transition-all duration-500",
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    {t("settings.notificationPreferences", {
                      defaultValue: "Notification Preferences",
                    })}
                  </CardTitle>
                  <CardDescription>
                    {t("settings.chooseNotificationMethod", {
                      defaultValue:
                        "Choose how you want to receive notifications",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Notifications */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {t("settings.emailNotifications", {
                        defaultValue: "Email Notifications",
                      })}
                    </h4>
                    <div className="space-y-4 pl-6">
                      <NotificationItem
                        id="emailNotifications"
                        checked={userData.emailNotifications}
                        onChange={(checked) =>
                          setUserData({
                            ...userData,
                            emailNotifications: checked,
                          })
                        }
                        title={t("settings.emailNotifications", {
                          defaultValue: "Email Notifications",
                        })}
                        description={t(
                          "settings.receiveNotificationsViaEmail",
                          {
                            defaultValue: "Receive notifications via email",
                          },
                        )}
                      />
                      <NotificationItem
                        id="newsletter"
                        checked={userData.newsletter}
                        onChange={(checked) =>
                          setUserData({ ...userData, newsletter: checked })
                        }
                        title={t("settings.newsletter", {
                          defaultValue: "Newsletter",
                        })}
                        description={t("settings.receiveWeeklyNewsletter", {
                          defaultValue: "Receive weekly newsletter",
                        })}
                      />
                      <NotificationItem
                        id="promotions"
                        checked={userData.promotions}
                        onChange={(checked) =>
                          setUserData({ ...userData, promotions: checked })
                        }
                        title={t("settings.promotionalEmails", {
                          defaultValue: "Promotional Emails",
                        })}
                        description={t("settings.receivePromotionalOffers", {
                          defaultValue: "Receive promotional offers",
                        })}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Push Notifications */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      {t("settings.pushNotifications", {
                        defaultValue: "Push Notifications",
                      })}
                    </h4>
                    <div className="space-y-4 pl-6">
                      <NotificationItem
                        id="pushNotifications"
                        checked={userData.pushNotifications}
                        onChange={(checked) =>
                          setUserData({
                            ...userData,
                            pushNotifications: checked,
                          })
                        }
                        title={t("settings.pushNotifications")}
                        description={t("settings.receivePushNotifications", {
                          defaultValue:
                            "Receive push notifications on your device",
                        })}
                      />
                      <NotificationItem
                        id="orderUpdates"
                        checked={userData.orderUpdates}
                        onChange={(checked) =>
                          setUserData({ ...userData, orderUpdates: checked })
                        }
                        title={t("settings.orderUpdates")}
                        description={t("settings.getNotifiedAboutOrderStatus", {
                          defaultValue:
                            "Get notified about order status updates",
                        })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="transition-all duration-300 hover:shadow-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Save Preferences
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent
              value="appearance"
              className={cn(
                "transition-all duration-500",
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    {t("settings.appearanceSettings", {
                      defaultValue: "Appearance Settings",
                    })}
                  </CardTitle>
                  <CardDescription>
                    {t("settings.customizeAppAppearance", {
                      defaultValue:
                        "Customize the appearance of the application",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>{t("settings.theme")}</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <ThemeCard
                        value="light"
                        currentTheme={userData.theme}
                        icon={<Sun className="w-6 h-6" />}
                        label={t("settings.light", {
                          defaultValue: "Light",
                        })}
                        onClick={() =>
                          setUserData({ ...userData, theme: "light" })
                        }
                      />
                      <ThemeCard
                        value="dark"
                        currentTheme={userData.theme}
                        icon={<Moon className="w-6 h-6" />}
                        label={t("settings.dark", {
                          defaultValue: "Dark",
                        })}
                        onClick={() =>
                          setUserData({ ...userData, theme: "dark" })
                        }
                      />
                      <ThemeCard
                        value="system"
                        currentTheme={userData.theme}
                        icon={<Smartphone className="w-6 h-6" />}
                        label={t("settings.system", {
                          defaultValue: "System",
                        })}
                        onClick={() =>
                          setUserData({ ...userData, theme: "system" })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="transition-all duration-300 hover:shadow-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          {t("settings.saving")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          {t("settings.saveChange")}
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent
              value="security"
              className={cn(
                "transition-all duration-500",
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <div className="grid gap-6">
                {/* Change Password */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      {t("settings.changePassword")}
                    </CardTitle>
                    <CardDescription>
                      {t("settings.changePasswordDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        {t("settings.currentPassword")}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder={t("settings.currentPasswordPlaceholder")}
                          className="pl-10 pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">
                          {t("settings.newPassword")}
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder={t("settings.newPasswordPlaceholder")}
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          {t("settings.confirmPassword")}
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder={t("settings.confirmPasswordPlaceholder")}
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <Button className="transition-all duration-300 hover:shadow-lg">
                      <Key className="w-4 h-4 mr-2" />
                      {t("settings.updatePassword")}
                    </Button>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <Shield className="w-5 h-5" />
                      {t("settings.accountActions")}
                    </CardTitle>
                    <CardDescription>
                      {t("settings.accountActionsDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-muted-foreground/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <LogOut className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {t("settings.signOutAll")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.signOutAllDesc")}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {t("settings.signOutAll")}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5 hover:border-destructive/50 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <Trash2 className="w-5 h-5 text-destructive" />
                        <div>
                          <p className="font-medium text-destructive">
                            {t("settings.deleteAccount")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("settings.deleteAccountDesc")}
                          </p>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm">
                        {t("settings.deleteAccountButton")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

// Notification Item Component
const NotificationItem = ({ id, checked, onChange, title, description }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start justify-between p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-300">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="cursor-pointer">
          {t(title)}
        </Label>
        <p className="text-sm text-muted-foreground">{t(description)}</p>
      </div>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="mt-1 transition-all duration-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
    </div>
  );
};

// Theme Card Component
const ThemeCard = ({ value, currentTheme, icon, label, onClick }) => {
  const { t } = useTranslation();
  const isSelected = currentTheme === value;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300",
        isSelected
          ? "border-primary bg-primary/10 shadow-md"
          : "border-border hover:border-primary/50 hover:bg-muted/30",
      )}
    >
      <div
        className={cn(
          "p-3 rounded-full transition-all duration-300",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <span className={cn("font-medium", isSelected && "text-primary")}>
        {t(label)}
      </span>
    </button>
  );
};

export default SettingsPage;
