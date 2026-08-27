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
import { CheckCircle2, ArrowLeft, Loader2, Mail } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email(t("auth.validationEmail")),
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    // Simulate frontend password reset flow
    setTimeout(() => {
      setIsLoading(false);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    form.reset({ email: submittedEmail });
  };

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-muted py-12 px-4">
      <Helmet>
        <title>{t("auth.forgotPasswordTitle")} - RazorBills</title>
      </Helmet>
      <div className="max-w-sm w-full flex flex-col items-center sm:border rounded-lg px-6 py-8 sm:shadow-sm/5 sm:bg-card">
        <Logo className="h-9 w-9" />
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-center">
          {t("auth.forgotPasswordTitle")}
        </h1>

        {!isSubmitted ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {t("auth.forgotPasswordDesc")}
            </p>

            <Form {...form}>
              <form
                className="w-full space-y-4 mt-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("auth.emailPlaceholder")}
                          className="w-full"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.sendingResetLink")}
                    </>
                  ) : (
                    t("auth.sendResetLink")
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
            <div className="space-y-1">
              <h2 className="font-semibold text-lg">{t("auth.resetLinkSent")}</h2>
              <p className="text-xs font-mono text-muted-foreground bg-muted p-1.5 rounded break-all flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {submittedEmail}
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("auth.resetLinkSentDesc")}
            </p>
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full text-xs"
            >
              {t("auth.tryDifferentEmail")}
            </Button>
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
