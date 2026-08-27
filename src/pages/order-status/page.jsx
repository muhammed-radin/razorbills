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
  MapPin,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export default function OrderStatusPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Mock order details
  const order = {
    id: "#ORD-1024",
    date: "Jul 21, 2026",
    statusKey: "processing", // "orderPlaced" | "processing" | "shipped" | "delivered"
    statusIndex: 1, // 0 = Placed, 1 = Processing, 2 = Shipped, 3 = Delivered
    trackingNumber: "RB-IND-894231",
    courier: "Bluedart Express",
    estimatedDelivery: "Jul 25, 2026",
    shippingAddress: {
      name: "John Doe",
      street: "123 Technology Park, Flat 4B",
      city: "Kochi",
      state: "Kerala",
      postalCode: "682001",
      phone: "+91 9876543210",
    },
    items: [
      {
        id: 1,
        name: "Wireless Noise Cancelling Headphones",
        sku: "TECH-HD-09",
        image: "/products/Headphone.jpg",
        price: "₹4,999.00",
        quantity: 1,
        total: "₹4,999.00",
      },
    ],
    subtotal: "₹4,999.00",
    shippingFee: t("orderStatus.free"),
    grandTotal: "₹4,999.00",
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
    }, 1200);
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    toast.success("Tracking number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{t("orderStatus.title")} - {order.id} - RazorBills</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/order")}
              >
                <ArrowLeft className="w-4 h-4" />
                {t("orderStatus.backToOrders")}
              </Button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
              {t("orderStatus.title")}
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

        {/* Order Summary & Status Badge */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold font-mono">
                    {order.id}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                    {t(`orderStatus.${order.statusKey}`)}
                  </Badge>
                </div>
                <CardDescription>
                  {t("orderStatus.orderDate")}: {order.date}
                </CardDescription>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted-foreground block">
                  {t("orderStatus.grandTotal")}
                </span>
                <span className="text-xl font-bold text-foreground">
                  {order.grandTotal}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            {/* Status Stepper Progression */}
            <div className="py-6 px-2 sm:px-4">
              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{
                      width: `${(order.statusIndex / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < order.statusIndex;
                    const isCurrent = idx === order.statusIndex;
                    const isUpcoming = idx > order.statusIndex;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2"
                      >
                        {/* Step Icon / Circle */}
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

                        {/* Step Label */}
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

            {/* Tracking & Courier Partner Info */}
            <div className="mt-4 p-4 rounded-lg bg-muted/40 border grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-muted-foreground block">
                  {t("orderStatus.courierPartner")}
                </span>
                <span className="text-sm font-medium">{order.courier}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">
                  {t("orderStatus.trackingNumber")}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-mono font-medium">
                    {order.trackingNumber}
                  </span>
                  <button
                    onClick={handleCopyTracking}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy tracking number"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">
                  {t("orderStatus.estimatedDelivery")}
                </span>
                <span className="text-sm font-medium text-primary">
                  {order.estimatedDelivery}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items & Shipping Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items Card (2 Cols) */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {t("orderStatus.items")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-2 border-b last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover border shrink-0 bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-sm truncate text-foreground">
                      {item.name}
                    </h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      SKU: {item.sku}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>
                        {t("orderStatus.quantity")}: {item.quantity}
                      </span>
                      <span>
                        {t("orderStatus.price")}: {item.price}
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-sm">
                    {item.total}
                  </div>
                </div>
              ))}

              <Separator className="my-2" />

              {/* Order Cost Breakdown */}
              <div className="space-y-1.5 text-sm pt-1">
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
                <Separator className="my-1.5" />
                <div className="flex justify-between font-bold text-base pt-1">
                  <span>{t("orderStatus.grandTotal")}</span>
                  <span className="text-primary">{order.grandTotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address Card (1 Col) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {t("orderStatus.shippingAddress")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">
                {order.shippingAddress.name}
              </p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="pt-2 text-xs">
                Phone: {order.shippingAddress.phone}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
