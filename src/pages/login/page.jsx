import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { encryptStrict } from "@/utils/crypt";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import onUserGoogleSignIn from "@/utils/hooks/googleProviderSignIn";
import { authClient } from "@/lib/auth-client";
import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";
import GoogleLogo from "@/components/auth/google-logo";
import AuthLayout from "@/components/auth/auth-layout";
import { api } from "@/utils/api";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formShake, setFormShake] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // ── Memoized Zod Schema ──
  const formSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .email(
            t("auth.validationEmail", {
              default: "Please enter a valid email address",
            }),
          ),
        password: z.string().min(
          8,
          t("auth.validationPassword", {
            default: "Password must be at least 8 characters long",
          }),
        ),
      }),
    [t],
  );

  const form = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(formSchema),
  });

  // ── Submit handler ──
  const submitForm = useCallback(
    (data) => {
      toast.promise(
        () =>
          new Promise((resolveui, rejectui) => {
            authClient.signIn
              .email(data, {
                onSuccess: (payload) => {
                  if (payload.response.status === 200) {
                    resolveui(
                      t("auth.loginSuccess", { default: "Login Successful" }),
                    );
                    api.clearSessionCache();
                    navigate("/");
                  } else {
                    rejectui(payload.response.statusText || "Login failed");
                  }
                },
                onError: (error) => {
                  rejectui(error);
                  setTimeout(() => form.setValue("password", ""), 800);
                },
              })
              .then(({ error }) => {
                if (error) rejectui(error);
              })
              .catch((error) => rejectui(error));
          }),
        {
          loading: t("auth.loggingIn", { default: "Logging in..." }),
          success: (msg) => {
            setIsSubmitting(false);
            return `${msg}`;
          },
          error: (err) => {
            setIsSubmitting(false);
            setFormShake(true);
            setTimeout(() => setFormShake(false), 600);
            const message =
              err?.message ||
              err?.error?.message ||
              (typeof err === "string" && err) ||
              err?.error?.statusText ||
              (typeof err?.error === "string" && err?.error) ||
              "Unknown error";
            return t("auth.loginFailed", {
              error: message,
              default: `Login failed: ${message}`,
            });
          },
        },
      );
    },
    [t, navigate, form],
  );

  const onSubmit = useCallback(
    (data) => {
      const encrypted = {
        email: data.email,
        password: encryptStrict(data.password),
      };
      setIsSubmitting(true);
      submitForm(encrypted);
    },
    [submitForm],
  );

  // ── Google Sign-In handler ──
  const handleGoogleSignIn = useCallback(() => {
    setIsSubmitting(true);
    onUserGoogleSignIn(setIsSubmitting);
  }, []);

  // ── Single check for session & URL params ──
  const [urlParams] = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    authClient.getSession().then(({ data: session }) => {
      if (session?.user && !session.user.isAnonymous) {
        navigate("/");
      }
    });

    const authParam = urlParams.get("auth");
    const successParam = urlParams.get("success");

    if (!hasRun.current) {
      hasRun.current = true;

      if (authParam === "google" && successParam === "true") {
        toast.success(
          t("auth.googleSignInSuccess", {
            default: "Google sign-in successful",
          }),
        );
        navigate("/");
      } else if (authParam === "google" && successParam === "false") {
        toast.error(
          t("auth.googleSignInFailed", {
            default: "Google sign-in failed, Try again.",
          }),
        );
      }
    }

    const email = urlParams.get("email");
    const pw = urlParams.get("pw");
    const signup = urlParams.get("signup");

    if (email && pw && signup) {
      form.setValue("email", decodeURIComponent(email));
      form.setValue("password", decodeURIComponent(pw));
      submitForm({
        email: decodeURIComponent(email),
        password: decodeURIComponent(pw),
      });
    }
  }, [urlParams, navigate, t, form, submitForm]);

  return (
    <AuthLayout
      type="login"
      title={t("auth.loginTitle", { default: "Log in to RazorBillz" })}
      subtitle="Enter your email and password below to access your account."
      seoTitle={t("auth.loginTitle", { default: "Login" })}
    >
      <div className="space-y-3 sm:space-y-4">
        {/* ── Google OAuth Button ── */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full gap-2.5 h-10 text-xs sm:text-sm font-medium border-border/80 hover:bg-accent/60 hover:text-accent-foreground shadow-sm transition-all duration-200"
          disabled={isSubmitting}
          onClick={handleGoogleSignIn}
          aria-label={t("auth.continueWithGoogle", {
            default: "Continue with Google",
          })}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleLogo />
          )}
          <span>
            {t("auth.continueWithGoogle", { default: "Continue with Google" })}
          </span>
        </Button>

        {/* ── Divider ── */}
        <div className="relative my-2 sm:my-3 flex items-center justify-center">
          <Separator className="w-full" />
          <span className="absolute bg-background px-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {t("auth.or", { default: "OR" })}
          </span>
        </div>

        {/* ── Email / Password form ── */}
        <Form {...form}>
          <form
            className={`space-y-2.5 sm:space-y-3.5 ${formShake ? "auth-shake" : ""}`}
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            aria-label="Login form"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    {t("auth.email", { default: "Email" })}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70 pointer-events-none" />
                      <Input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder={t("auth.emailPlaceholder", {
                          default: "you@example.com",
                        })}
                        className="pl-9 h-9 sm:h-10 text-xs sm:text-sm rounded-lg bg-background border-border/80 focus-visible:ring-1 transition-all"
                        disabled={isSubmitting}
                        aria-required="true"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-semibold">
                      {t("auth.password", { default: "Password" })}
                    </FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] sm:text-xs text-primary hover:underline underline-offset-4 font-medium transition-colors"
                      tabIndex={isSubmitting ? -1 : 0}
                    >
                      {t("auth.forgotPassword", {
                        default: "Forgot password?",
                      })}
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70 pointer-events-none" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="pl-9 pr-9 h-9 sm:h-10 text-xs sm:text-sm rounded-lg bg-background border-border/80 focus-visible:ring-1 transition-all"
                        disabled={isSubmitting}
                        aria-required="true"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-ring"
                        tabIndex={-1}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Remember me toggle */}
            <div className="flex items-center justify-between pt-0.5">
              <label
                htmlFor="remember-me"
                className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
              >
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(val) => setRememberMe(!!val)}
                  disabled={isSubmitting}
                  className="rounded"
                />
                <span className="text-[11px] sm:text-xs">Remember me</span>
              </label>

              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-9 sm:h-10 gap-2 mt-2 font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              <span>
                {t("auth.continueWithEmail", { default: "Log In with Email" })}
              </span>
            </Button>
          </form>
        </Form>

        {/* ── Sign-up switch link ── */}
        <div className="pt-2 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("auth.dontHaveAccount", { default: "Don't have an account?" })}{" "}
            <Link
              to="/signup"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors ml-1"
            >
              {t("auth.createAccount", { default: "Create account" })}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
