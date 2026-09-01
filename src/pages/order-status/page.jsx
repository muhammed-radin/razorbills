import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  MapPin,
  Check,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function OrderStatusPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  // Mock order details for frontend MVP
  const order = {
    id: "#ORD-1024",
    date: "Jul 21, 2026",
    statusKey: "processing", // "orderPlaced" | "processing" | "shipped" | "delivered"
    statusIndex: 1, // 0 = Placed, 1 = Processing, 2 = Shipped, 3 = Delivered
    paymentStatus: t("orderStatus.paid"),
    paymentMethod: "Credit Card (•••• 4242)",
    trackingNumber: "RB-IND-894231",
    courier: "Bluedart Express",
    estimatedDelivery: "Jul 25, 2026",
    items: [
      {
        id: 1,
        name: "Wireless Noise Cancelling Headphones",
        image: "/products/Headphone.jpg",
        quantity: 1,
        unitPrice: "₹4,999.00",
        totalPrice: "₹4,999.00",
      },
    ],
    subtotal: "₹4,999.00",
    shippingFee: t("orderStatus.free"),
    totalAmount: "₹4,999.00",
  };

  const steps = [
    {
      key: "orderPlaced",
      label: t("orderStatus.orderPlaced"),
      desc: t("orderStatus.orderPlacedDesc"),
      icon: Clock,
    },
    {
      key: "processing",
      label: t("orderStatus.processing"),
      desc: t("orderStatus.processingDesc"),
      icon: Package,
    },
    {
      key: "shipped",
      label: t("orderStatus.shipped"),
      desc: t("orderStatus.shippedDesc"),
      icon: Truck,
    },
    {
      key: "delivered",
      label: t("orderStatus.delivered"),
      desc: t("orderStatus.deliveredDesc"),
      icon: CheckCircle2,
    },
  ];

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    toast.info(t("orderStatus.downloadingInvoice"));
    setTimeout(() => {
      setIsDownloading(false);
      toast.success(t("orderStatus.invoiceDownloaded"));
    }, 1000);
  };

  const handleTrackStatus = () => {
    toast.info(`${t("orderStatus.courierPartner")}: ${order.courier} (${order.trackingNumber})`);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{t("orderStatus.title")} - {order.id} - RazorBills</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation / Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/order")}
            >
              <ArrowLeft className="w-4 h-4" />
              {t("orderStatus.backToOrders")}
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
              {t("orderStatus.orderSummary")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("orderStatus.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
            >
              <Download className="w-4 h-4" />
              {t("orderStatus.downloadInvoice")}
            </Button>
            <Button size="sm" asChild>
              <Link to="/">
                <ShoppingBag className="w-4 h-4 mr-2" />
                {t("orderStatus.continueShopping")}
              </Link>
            </Button>
          </div>
        </div>

        {/* 1. Order Information Box */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {t("orderStatus.orderInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 rounded-lg bg-muted/30 border">
              <div>
                <span className="text-xs text-muted-foreground block">
                  {t("orderStatus.orderId")}
                </span>
                <span className="text-sm font-semibold font-mono text-foreground">
                  {order.id}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">
                  {t("orderStatus.orderDate")}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {order.date}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">
                  {t("orderStatus.orderStatus")}
                </span>
                <Badge variant="secondary" className="mt-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                  {t(`orderStatus.${order.statusKey}`)}
                </Badge>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">
                  {t("orderStatus.paymentStatus")}
                </span>
                <Badge variant="outline" className="mt-0.5 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 font-medium">
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs text-muted-foreground block">
                  {t("orderStatus.totalAmount")}
                </span>
                <span className="text-base font-bold text-primary">
                  {order.totalAmount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Current Order Status Stepper */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {t("orderStatus.currentStatus")}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-primary"
                onClick={handleTrackStatus}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t("orderStatus.trackStatus")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="py-4 px-2 sm:px-4">
              <div className="relative">
                {/* Stepper Connecting Bar */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{
                      width: `${(order.statusIndex / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Stepper Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < order.statusIndex;
                    const isCurrent = idx === order.statusIndex;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 transition-all duration-300 z-10 ${
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground"
                              : isCurrent
                              ? "bg-background border-primary text-primary ring-4 ring-primary/20"
                              : "bg-muted border-muted-foreground/30 text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>

                        <div className="sm:mt-2 text-left sm:text-center">
                          <h4
                            className={`text-sm font-semibold ${
                              isCurrent
                                ? "text-primary font-bold"
                                : isCompleted
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-[160px] sm:mx-auto">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Product Summary Block */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {t("orderStatus.productSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-muted-foreground border-b bg-muted/20">
                  <tr>
                    <th className="py-3 px-4 font-medium">{t("orderStatus.items")}</th>
                    <th className="py-3 px-4 font-medium text-center">{t("orderStatus.quantity")}</th>
                    <th className="py-3 px-4 font-medium text-right">{t("orderStatus.unitPrice")}</th>
                    <th className="py-3 px-4 font-medium text-right">{t("orderStatus.totalPrice")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10">
                      <td className="py-4 px-4 flex items-center gap-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-md object-cover border shrink-0 bg-muted"
                        />
                        <span className="font-semibold text-sm text-foreground">
                          {item.name}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-medium">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right text-muted-foreground">
                        {item.unitPrice}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-foreground">
                        {item.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Separator className="my-2" />

            {/* Cost Breakdown */}
            <div className="space-y-2 max-w-xs ml-auto text-sm pt-2">
              <div className="flex justify-between text-muted-foreground">
                <span>{t("orderStatus.subtotal")}</span>
                <span>{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t("orderStatus.shippingFee")}</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {order.shippingFee}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base pt-1">
                <span>{t("orderStatus.total")}</span>
                <span className="text-primary">{order.totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
