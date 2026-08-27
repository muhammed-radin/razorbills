import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Receipt,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  Mail,
  Calendar,
  PackageCheck,
} from "lucide-react";

export default function PaymentSuccessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mock payment/order data for frontend display
  const paymentDetails = {
    orderId: "#ORD-1024",
    transactionId: "TXN-98432170",
    amount: "₹4,999.00",
    paymentMethod: "Credit Card (•••• 4242)",
    status: t("paymentSuccess.paid"),
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
      <Helmet>
        <title>{t("paymentSuccess.title")} - RazorBills</title>
      </Helmet>

      <div className="max-w-xl w-full">
        <Card className="border-border shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4 animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t("paymentSuccess.title")}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2 max-w-md mx-auto">
              {t("paymentSuccess.subtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Payment Summary Box */}
            <div className="rounded-lg border bg-muted/40 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("paymentSuccess.orderId")}
                </span>
                <span className="text-sm font-semibold font-mono">
                  {paymentDetails.orderId}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("paymentSuccess.paymentStatus")}
                </span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 font-medium">
                  {paymentDetails.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("paymentSuccess.paymentMethod")}
                </span>
                <span className="text-sm font-medium flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  {paymentDetails.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("paymentSuccess.date")}
                </span>
                <span className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {paymentDetails.date}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("paymentSuccess.transactionId")}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {paymentDetails.transactionId}
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-center justify-between pt-1">
                <span className="text-base font-semibold">
                  {t("paymentSuccess.amountPaid")}
                </span>
                <span className="text-lg font-bold text-primary">
                  {paymentDetails.amount}
                </span>
              </div>
            </div>

            {/* Email Notification Note */}
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-primary/5 border border-primary/10 text-xs sm:text-sm text-muted-foreground">
              <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{t("paymentSuccess.confirmationEmail")}</span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              className="w-full sm:w-1/2 gap-2"
              onClick={() => navigate("/order-status")}
            >
              <PackageCheck className="w-4 h-4" />
              {t("paymentSuccess.viewOrder")}
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-1/2 gap-2"
              asChild
            >
              <Link to="/">
                <ShoppingBag className="w-4 h-4" />
                {t("paymentSuccess.continueShopping")}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
