import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle2, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordSchema = z
    .object({
      newPassword: z
        .string()
        .min(1, t("auth.passwordRequired"))
        .min(8, t("auth.validationPassword"))
        .regex(/[A-Z]/, t("auth.validationPasswordUppercase"))
        .regex(/[a-z]/, t("auth.validationPasswordLowercase"))
        .regex(/[0-9]/, t("auth.validationPasswordNumber"))
        .regex(/[@$!%*?&#]/, t("auth.validationPasswordSpecial")),
      confirmPassword: z
        .string()
        .min(1, t("auth.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("auth.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = () => {
    setIsLoading(true);
    // Simulate frontend password reset
    setTimeout(() => {
      setIsLoading(false);
      form.reset({ newPassword: "", confirmPassword: "" });
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-muted py-12 px-4">
      <Helmet>
        <title>{t("auth.forgotPasswordTitle")} - RazorBills</title>
      </Helmet>
      <div className="max-w-sm w-full flex flex-col items-center sm:border rounded-lg px-6 py-8 sm:shadow-sm/5 sm:bg-card">
        <Logo className="h-9 w-9" />
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-center">
          {isSuccess
            ? t("auth.passwordResetSuccess")
            : t("auth.resetPassword")}
        </h1>

        {!isSuccess ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {t("auth.setNewPasswordDesc")}
            </p>

            <Form {...form}>
              <form
                className="w-full space-y-4 mt-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.newPassword")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder={t("auth.newPasswordPlaceholder")}
                            className="w-full pr-10"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={
                              showNewPassword
                                ? t("auth.hidePassword")
                                : t("auth.showPassword")
                            }
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t("auth.confirmPasswordPlaceholder")}
                            className="w-full pr-10"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={
                              showConfirmPassword
                                ? t("auth.hidePassword")
                                : t("auth.showPassword")
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.resettingPassword")}
                    </>
                  ) : (
                    t("auth.resetPassword")
                  )}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <div className="w-full mt-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("auth.passwordResetSuccessDesc")}
            </p>
            <Link to="/login" className="w-full">
              <Button className="w-full">{t("auth.backToLogin")}</Button>
            </Link>
          </div>
        )}

        <div className="mt-6 pt-4 border-t w-full text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("auth.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
