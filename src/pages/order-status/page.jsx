import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  FileQuestion,
  Hash,
  LifeBuoy,
  Loader2,
  Mail,
  MapPin,
  Package,
  PackageCheck,
  PackageOpen,
  Phone,
  Printer,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Truck,
  Undo2,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { StoreMeta } from "@/components/store-meta";
import { useOrderStore } from "@/stores/shop";
import { paymentsApi, shipmentsApi } from "@/services/shop";
import { decryptField } from "@/utils/crypt";
import { currency } from "@/utils/currency";
import { loadRazorpayCheckout, openRazorpayCheckout } from "@/utils/razorpay";
import { cn } from "@/lib/utils";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ===========================================================================
 * Helpers
 * ========================================================================= */

/**
 * Recursively decrypt every string property that arrived from the server.
 * `decryptField` passes plain text through untouched, so this is safe to run
 * over the whole payload (PII is encrypted at rest; everything else is left
 * exactly as-is).
 */
function deepDecrypt(value) {
  if (typeof value === "string") return decryptField(value);
  if (Array.isArray(value)) return value.map(deepDecrypt);
  if (value && typeof value === "object") {
    if (value instanceof Date) return value;
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = deepDecrypt(val);
    }
    return out;
  }
  return value;
}

/** Normalise the raw order document into the view model used by the page. */
function buildOrder(raw) {
  const d = deepDecrypt(raw);
  const products = Array.isArray(d.products) ? d.products : [];

  const items = products.map((p, i) => ({
    id: p.productId ?? String(i),
    name: p.title ?? "Product",
    image: p.thumbnail ?? "",
    sku: p.sku ?? "",
    category: p.category ?? "",
    brand: p.brand ?? "",
    price: p.price ?? 0,
    originalPrice: p.originalPrice ?? p.price ?? 0,
    quantity: p.quantity ?? 1,
  }));

  const subtotal =
    d.subtotal ?? items.reduce((s, it) => s + it.price * it.quantity, 0);
  const address = d.shippingAddress ?? {};
  const fulfillment = d.fulfillment ?? {};

  return {
    id: d.id ?? d._id ?? "",
    createdAt: d.createdAt ?? d.orderDate ?? null,
    status: d.status ?? "pending",
    currency: d.currency ?? "INR",
    items,
    subtotal,
    discount: d.discount?.amount ?? 0,
    discountCodes: d.discount?.codes ?? [],
    tax: d.taxAmount ?? d.tax ?? 0,
    shipping: d.shippingAmount ?? 0,
    codFee: d.codFee ?? 0,
    total: d.totalAmount ?? subtotal,
    address: {
      name: address.name ?? "",
      street: address.street ?? address.address ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      postalCode:
        address.postalCode ?? address.pincode ?? address.zipCode ?? "",
      country: address.country ?? "India",
      phoneNumber: address.phoneNumber ?? address.phone ?? "",
      email: address.email ?? "",
    },
    payment: {
      method: d.payment?.method ?? null,
      status: d.payment?.status ?? "pending",
      codStatus: d.payment?.codStatus ?? null,
      razorpayPaymentId: d.payment?.razorpayPaymentId ?? null,
      transactionId: d.payment?.transactionId ?? null,
      amountPaid: d.payment?.amountPaid ?? 0,
      failureReason: d.payment?.failureReason ?? null,
    },
    fulfillment: {
      status: fulfillment.status ?? null,
      courierName: fulfillment.courierName ?? null,
      serviceName: fulfillment.serviceName ?? null,
      awb: fulfillment.awb ?? fulfillment.trackingNumber ?? null,
      trackingUrl: fulfillment.trackingUrl ?? null,
      estimatedDelivery: fulfillment.estimatedDelivery ?? null,
      history: Array.isArray(fulfillment.history) ? fulfillment.history : [],
    },
    cancellation: d.cancellation ?? {},
    return: d.return ?? {},
    refund: d.refund ?? {},
    statusHistory: Array.isArray(d.statusHistory) ? d.statusHistory : [],
  };
}

const formatMoney = (amount, code = "INR") =>
  currency(Number(amount ?? 0), undefined, code);

function formatDate(value, opts) {
  if (!value) return "—";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return String(value);
  return dt.toLocaleDateString("en-IN", opts);
}

function formatDateTime(value) {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return String(value);
  return dt.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const prettify = (value) =>
  value
    ? String(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

/* Status presentation ------------------------------------------------------ */

const STATUS_META = {
  pending: {
    label: "Pending Payment",
    icon: AlertCircle,
    className: "border-transparent bg-amber-500/10 text-amber-600",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "border-transparent bg-emerald-500/10 text-emerald-600",
  },
  processing: {
    label: "Processing",
    icon: PackageOpen,
    className: "border-transparent bg-amber-500/10 text-amber-600",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "border-transparent bg-blue-500/10 text-blue-600",
  },
  delivered: {
    label: "Delivered",
    icon: PackageCheck,
    className: "border-transparent bg-emerald-500/10 text-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "border-transparent bg-red-500/10 text-red-600",
  },
  return_requested: {
    label: "Return Requested",
    icon: RotateCcw,
    className: "border-transparent bg-orange-500/10 text-orange-600",
  },
  returned: {
    label: "Returned",
    icon: Undo2,
    className: "border-transparent bg-purple-500/10 text-purple-600",
  },
};

const PAYMENT_META = {
  pending: {
    label: "Pending",
    className: "border-transparent bg-amber-500/10 text-amber-600",
  },
  paid: {
    label: "Paid",
    className: "border-transparent bg-emerald-500/10 text-emerald-600",
  },
  failed: {
    label: "Failed",
    className: "border-transparent bg-red-500/10 text-red-600",
  },
  refund_pending: {
    label: "Refund Pending",
    className: "border-transparent bg-amber-500/10 text-amber-600",
  },
  partially_refunded: {
    label: "Partially Refunded",
    className: "border-transparent bg-blue-500/10 text-blue-600",
  },
  refunded: {
    label: "Refunded",
    className: "border-transparent bg-purple-500/10 text-purple-600",
  },
};

function StatusBadge({ status, className }) {
  const meta = STATUS_META[status] ?? {
    label: prettify(status) || "Order Placed",
    icon: Package,
    className: "border-transparent bg-muted text-muted-foreground",
  };
  const Icon = meta.icon;
  return (
    <Badge variant="outline" className={cn(meta.className, className)}>
      <Icon className="size-3.5" />
      {meta.label}
    </Badge>
  );
}

function PaymentBadge({ status }) {
  const meta = PAYMENT_META[status] ?? {
    label: prettify(status),
    className: "border-transparent bg-muted text-muted-foreground",
  };
  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
}

/* Progress stepper --------------------------------------------------------- */

const STEPS = [
  {
    key: "placed",
    icon: BadgeCheck,
    label: "Order Placed",
    desc: "Your order has been received",
  },
  {
    key: "processing",
    icon: PackageOpen,
    label: "Processing",
    desc: "Items are being packed",
  },
  {
    key: "shipped",
    icon: Truck,
    label: "Shipped",
    desc: "Handed to the courier partner",
  },
  {
    key: "delivered",
    icon: PackageCheck,
    label: "Delivered",
    desc: "Delivered to your address",
  },
];

const STATUS_STEP_INDEX = {
  pending: 0,
  confirmed: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  return_requested: 3,
  returned: 3,
};

function OrderProgress({ status }) {
  const current = STATUS_STEP_INDEX[status] ?? 0;
  const isClosed = status === "cancelled";

  return (
    <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const done = !isClosed && index < current;
        const active = !isClosed && index === current;
        return (
          <li key={step.key} className="relative flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                  done && "border-emerald-500 bg-emerald-500 text-white",
                  active &&
                    "border-primary bg-primary text-primary-foreground ring-4 ring-primary/15",
                  !done &&
                    !active &&
                    "border-border bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
              </span>
              {index < STEPS.length - 1 && (
                <span
                  className={cn(
                    "hidden h-0.5 flex-1 rounded-full sm:block",
                    done ? "bg-emerald-500" : "bg-border",
                  )}
                />
              )}
            </div>
            <div className="pr-2">
              <p
                className={cn(
                  "text-sm font-medium",
                  !done && !active && "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* Small building blocks ---------------------------------------------------- */

function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-foreground"
          onClick={copy}
          disabled={!value}
          aria-label={label}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-600" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : label}</TooltipContent>
    </Tooltip>
  );
}

function InfoRow({ icon: Icon, label, value, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="size-4 shrink-0" />}
        {label}
      </span>
      <span className="text-right font-medium">{children ?? value}</span>
    </div>
  );
}

function SectionCard({ icon: Icon, title, description, action, children }) {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
            )}
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              {description && (
                <CardDescription className="text-xs">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Timeline({ entries, emptyLabel = "No updates yet" }) {
  if (!entries?.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  return (
    <ol className="relative space-y-4 border-l-0 border-border pl-6">
      {entries.map((entry, index) => {
        const meta = STATUS_META[entry.status];
        const Icon = meta?.icon ?? Package;
        return (
          <li key={`${entry.status}-${index}`} className="relative">
            <span
              className={cn(
                "absolute -left-[27px] flex size-5 items-center justify-center rounded-full",
                meta?.className ?? "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-3" />
            </span>
            <p className="text-sm font-medium">
              {meta?.label ?? (prettify(entry.status) || "Update")}
            </p>
            {(entry.note || entry.message) && (
              <p className="text-xs text-muted-foreground">
                {entry.note || entry.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {formatDateTime(entry.timestamp)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

/* ===========================================================================
 * Page
 * ========================================================================= */

export default function OrderStatusPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const rawId = params.get("id");
  // Accept internal ORD- ids only.
  const orderId =
    rawId && /^ORD-[A-Za-z0-9-]+$/.test(rawId.trim()) ? rawId.trim() : null;
  const idInvalid = Boolean(rawId) && !orderId;

  const detail = useOrderStore((s) => s.detail);
  const loading = useOrderStore((s) => s.loading);
  const storeError = useOrderStore((s) => s.error);
  const fetchDetail = useOrderStore((s) => s.fetchDetail);

  const [retrying, setRetrying] = useState(false);
  const [tracking, setTracking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    if (orderId) fetchDetail(orderId).catch(() => {});
  }, [orderId, fetchDetail]);

  // Decrypt every property that came from the server before rendering.
  const order = useMemo(() => (detail ? buildOrder(detail) : null), [detail]);

  const retryPayment = async () => {
    if (!orderId || !order) return;
    setRetrying(true);
    try {
      const init = await paymentsApi.createRazorpay(orderId);
      await loadRazorpayCheckout();
      openRazorpayCheckout({
        keyId: init.keyId ?? import.meta.env.VITE_RAZORPAY_KEY_ID,
        razorpayOrderId: init.razorpayOrderId,
        amountInr: init.amount ?? order.total,
        orderId,
        onSuccess: async (resp) => {
          try {
            await paymentsApi.verifyRazorpay({
              orderId,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            toast.success("Payment verified.");
            fetchDetail(orderId).catch(() => {});
          } catch {
            toast.error("Verification failed.");
          } finally {
            setRetrying(false);
          }
        },
        onDismiss: async (gatewayError) => {
          try {
            await paymentsApi.reportFailed(orderId, {
              cancelled: !gatewayError,
              reason: gatewayError?.description,
            });
          } catch {
            /* intentional no-op */
          }
          fetchDetail(orderId).catch(() => {});
          toast.info("Payment window closed. Order saved — retry anytime.");
          setRetrying(false);
        },
      });
    } catch (err) {
      toast.error(
        err?.response?.data?.error?.message ??
          err?.response?.data?.error ??
          "Could not start payment retry.",
      );
      setRetrying(false);
    }
  };

  const refreshTracking = async () => {
    if (!orderId) return;
    setTrackingLoading(true);
    try {
      const resp = await shipmentsApi.track(orderId);
      setTracking(deepDecrypt(resp));
    } catch (err) {
      toast.error(err?.response?.data?.error ?? "Tracking sync failed");
    } finally {
      setTrackingLoading(false);
    }
  };

  const state = !orderId
    ? "no-order"
    : idInvalid
      ? "invalid"
      : loading && !detail
        ? "loading"
        : !detail
          ? "not-found"
          : "ready";

  return (
    <TooltipProvider delayDuration={200}>
      <StoreMeta title={t("orderStatus.title")} noIndex />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">{t("nav.home", "Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/order">{t("orderStatus.backToOrders")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("orderStatus.title")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {state === "no-order" && (
          <StateCard
            icon={Package}
            title="No order selected"
            description="Open an order from your order history to track its status."
          >
            <Button asChild>
              <Link to="/order">
                <Package className="size-4" />
                {t("orderStatus.backToOrders")}
              </Link>
            </Button>
          </StateCard>
        )}

        {state === "invalid" && (
          <StateCard
            icon={FileQuestion}
            title="That order link looks invalid"
            description="The order reference in this link isn't in the expected format. Open an order from your history instead."
          >
            <Button asChild>
              <Link to="/order">
                <Package className="size-4" />
                {t("orderStatus.backToOrders")}
              </Link>
            </Button>
          </StateCard>
        )}

        {state === "loading" && <OrderLoading />}

        {state === "not-found" && (
          <StateCard
            icon={AlertCircle}
            title={
              storeError?.response?.status === 403
                ? "This order belongs to another account"
                : "Order not found"
            }
            description={
              storeError?.response?.status === 403
                ? "You don't have permission to view this order."
                : "We couldn't find this order, or you don't have access to it."
            }
          >
            <Button
              variant="outline"
              onClick={() => orderId && fetchDetail(orderId).catch(() => {})}
            >
              <RefreshCw className="size-4" />
              Retry
            </Button>
            <Button asChild variant="ghost">
              <Link to="/order">My orders</Link>
            </Button>
          </StateCard>
        )}

        {state === "ready" && order && (
          <OrderView
            order={order}
            tracking={tracking}
            trackingLoading={trackingLoading}
            onRefreshTracking={refreshTracking}
            retrying={retrying}
            onRetryPayment={retryPayment}
          />
        )}
      </div>
    </TooltipProvider>
  );
}

/* ===========================================================================
 * Ready view
 * ========================================================================= */

function OrderView({
  order,
  tracking,
  trackingLoading,
  onRefreshTracking,
  retrying,
  onRetryPayment,
}) {
  const { t } = useTranslation();
  const [expandedTimeline, setExpandedTimeline] = useState(false);

  const isCod = order.payment.method === "cod";
  const canRetry =
    !isCod && ["pending", "failed"].includes(order.payment.status);

  const awb = order.fulfillment.awb;
  const trackingHistory =
    Array.isArray(tracking?.history) && tracking.history.length
      ? tracking.history
      : order.fulfillment.history;

  const hasRequests =
    (order.cancellation.status && order.cancellation.status !== "none") ||
    (order.return.status && order.return.status !== "none");

  const timeline = order.statusHistory.length
    ? [...order.statusHistory].reverse()
    : [];
  const visibleTimeline = expandedTimeline ? timeline : timeline.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="overflow-hidden shadow-none">
        <div className="border-b bg-gradient-to-r from-primary/5 via-transparent to-transparent p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CheckCircle2 className="size-6" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {t("orderStatus.title")}
                  </h1>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("orderStatus.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="size-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/support">
                  <LifeBuoy className="size-4" />
                  <span className="hidden sm:inline">
                    {t("common.contactSupport", "Contact Support")}
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetaTile
              icon={Hash}
              label={t("orderStatus.orderId")}
              value={order.id}
              mono
              copyable
            />
            <MetaTile
              icon={CalendarDays}
              label={t("orderStatus.orderDate")}
              value={formatDate(order.createdAt, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <MetaTile
              icon={Wallet}
              label={t("orderStatus.totalAmount")}
              value={formatMoney(order.total, order.currency)}
            />
            <MetaTile
              icon={isCod ? Banknote : CreditCard}
              label="Payment"
              value={isCod ? "Cash on Delivery" : "Razorpay (prepaid)"}
            />
          </div>

          <Separator className="my-6" />

          {order.status === "cancelled" ? (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <XCircle className="size-4 shrink-0" />
              This order was cancelled. No further action is required.
            </div>
          ) : (
            <OrderProgress status={order.status} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            icon={Package}
            title={t("orderStatus.items")}
            description={`${order.items.length} item(s)`}
          >
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex gap-4">
                    <div className="w-20 shrink-0">
                      <AspectRatio
                        ratio={1}
                        className="overflow-hidden rounded-lg border bg-muted"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-muted-foreground">
                            <Package className="size-6" />
                          </div>
                        )}
                      </AspectRatio>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium leading-snug">{item.name}</h3>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {item.brand && (
                          <Badge variant="secondary" className="font-normal">
                            {item.brand}
                          </Badge>
                        )}
                        {item.category && (
                          <Badge
                            variant="outline"
                            className="font-normal text-muted-foreground"
                          >
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      {item.sku && (
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {t("orderStatus.sku")}: {item.sku}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("orderStatus.quantity")}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatMoney(
                          item.price * item.quantity,
                          order.currency,
                        )}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {formatMoney(item.price, order.currency)} ×{" "}
                          {item.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                  {index < order.items.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={CreditCard} title={t("orderStatus.priceSummary")}>
            <div className="space-y-3 text-sm">
              <InfoRow
                label={t("orderStatus.subtotal")}
                value={formatMoney(order.subtotal, order.currency)}
              />
              {order.discount > 0 && (
                <InfoRow
                  label={`Discount${order.discountCodes.length ? ` (${order.discountCodes.join(", ")})` : ""}`}
                >
                  <span className="text-emerald-600">
                    −{formatMoney(order.discount, order.currency)}
                  </span>
                </InfoRow>
              )}
              <InfoRow
                label="Tax"
                value={formatMoney(order.tax, order.currency)}
              />
              <InfoRow
                label={t("orderStatus.shippingFee")}
                value={
                  order.shipping === 0
                    ? t("orderStatus.free")
                    : formatMoney(order.shipping, order.currency)
                }
              />
              {order.codFee > 0 && (
                <InfoRow
                  label="COD fee"
                  value={formatMoney(order.codFee, order.currency)}
                />
              )}
              <Separator />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>{t("orderStatus.grandTotal")}</span>
                <span>{formatMoney(order.total, order.currency)}</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={BadgeCheck}
            title={t("orderStatus.orderProgress")}
            description="Most recent updates first"
          >
            <Timeline
              entries={visibleTimeline}
              emptyLabel="No status updates recorded yet."
            />
            {timeline.length > 4 && (
              <Button
                variant="link"
                size="sm"
                className="mt-2 h-auto p-0"
                onClick={() => setExpandedTimeline((v) => !v)}
              >
                {expandedTimeline
                  ? "Show less"
                  : `Show all ${timeline.length} updates`}
              </Button>
            )}
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <SectionCard icon={MapPin} title={t("orderStatus.shippingAddress")}>
            <div className="space-y-3 text-sm">
              {order.address.name && (
                <p className="flex items-center gap-2 font-medium">
                  <User className="size-4 text-muted-foreground" />
                  {order.address.name}
                </p>
              )}
              {order.address.street && (
                <p className="text-muted-foreground">{order.address.street}</p>
              )}
              <p className="text-muted-foreground">
                {[order.address.city, order.address.state]
                  .filter(Boolean)
                  .join(", ")}
                {order.address.postalCode
                  ? ` - ${order.address.postalCode}`
                  : ""}
              </p>
              <p className="text-muted-foreground">{order.address.country}</p>

              {(order.address.phoneNumber || order.address.email) && (
                <>
                  <Separator />
                  {order.address.phoneNumber && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-4" />
                      {order.address.phoneNumber}
                    </p>
                  )}
                  {order.address.email && (
                    <p className="flex items-center gap-2 break-all text-muted-foreground">
                      <Mail className="size-4 shrink-0" />
                      {order.address.email}
                    </p>
                  )}
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard
            icon={isCod ? Banknote : CreditCard}
            title="Payment"
            action={<PaymentBadge status={order.payment.status} />}
          >
            <div className="space-y-3 text-sm">
              <InfoRow
                label="Method"
                value={isCod ? "Cash on Delivery" : "Razorpay (prepaid)"}
              />
              {isCod && order.payment.codStatus && (
                <InfoRow
                  label="Collection"
                  value={prettify(order.payment.codStatus)}
                />
              )}
              {order.payment.amountPaid > 0 && (
                <InfoRow
                  label="Amount paid"
                  value={formatMoney(order.payment.amountPaid, order.currency)}
                />
              )}
              {order.payment.razorpayPaymentId && (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="flex items-center gap-1">
                    <span className="max-w-[150px] truncate font-mono text-xs">
                      {order.payment.razorpayPaymentId}
                    </span>
                    <CopyButton value={order.payment.razorpayPaymentId} />
                  </span>
                </div>
              )}
              {order.payment.failureReason && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/5 p-2 text-xs text-destructive">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                  {order.payment.failureReason}
                </div>
              )}
              {canRetry && (
                <Button
                  size="sm"
                  className="mt-1 w-full"
                  disabled={retrying}
                  onClick={onRetryPayment}
                >
                  {retrying ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Opening Razorpay…
                    </>
                  ) : (
                    <>
                      <RefreshCw className="size-4" />
                      Retry payment
                    </>
                  )}
                </Button>
              )}
            </div>
          </SectionCard>

          <SectionCard
            icon={Truck}
            title={t("orderStatus.deliveryInformation")}
            action={
              order.fulfillment.status ? (
                <Badge variant="outline" className="capitalize">
                  {prettify(order.fulfillment.status)}
                </Badge>
              ) : null
            }
          >
            <div className="space-y-3 text-sm">
              <InfoRow
                label={t("orderStatus.courierPartner")}
                value={order.fulfillment.courierName ?? "—"}
              />
              {order.fulfillment.serviceName && (
                <InfoRow
                  label="Service"
                  value={order.fulfillment.serviceName}
                />
              )}
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground">
                  {t("orderStatus.trackingNumber")}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-mono text-xs">
                    {awb ?? "Not assigned"}
                  </span>
                  {awb && <CopyButton value={awb} />}
                </span>
              </div>
              {order.fulfillment.estimatedDelivery && (
                <InfoRow
                  icon={CalendarDays}
                  label={t("orderStatus.estimatedDelivery")}
                  value={formatDate(order.fulfillment.estimatedDelivery, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                />
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={trackingLoading || !awb}
                  onClick={onRefreshTracking}
                >
                  <RefreshCw
                    className={cn("size-4", trackingLoading && "animate-spin")}
                  />
                  {trackingLoading ? "Syncing…" : "Refresh"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={!awb && !order.fulfillment.trackingUrl}
                  asChild={Boolean(awb || order.fulfillment.trackingUrl)}
                >
                  {awb || order.fulfillment.trackingUrl ? (
                    <a
                      href={
                        order.fulfillment.trackingUrl ??
                        "https://panel.shipmozo.com/track-order"
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="size-4" />
                      Track
                    </a>
                  ) : (
                    <span>No tracking yet</span>
                  )}
                </Button>
              </div>

              {tracking?.stub && (
                <p className="text-xs text-muted-foreground">
                  Live tracking unavailable — courier not configured.
                </p>
              )}

              {trackingHistory.length > 0 && (
                <ScrollArea className="mt-1 h-40 rounded-md border p-3">
                  <Timeline entries={trackingHistory} />
                </ScrollArea>
              )}
            </div>
          </SectionCard>

          {hasRequests && (
            <SectionCard icon={RotateCcw} title="Requests">
              <div className="space-y-3 text-sm">
                {order.cancellation.status &&
                  order.cancellation.status !== "none" && (
                    <RequestBlock
                      icon={XCircle}
                      label="Cancellation"
                      data={order.cancellation}
                    />
                  )}
                {order.return.status && order.return.status !== "none" && (
                  <RequestBlock
                    icon={Undo2}
                    label="Return"
                    data={order.return}
                  />
                )}
                {order.refund.status && order.refund.status !== "none" && (
                  <RequestBlock
                    icon={Wallet}
                    label="Refund"
                    data={order.refund}
                  />
                )}
              </div>
            </SectionCard>
          )}

          <Card className="shadow-none">
            <CardContent className="flex items-center gap-3 p-4 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
              Payments are processed securely. Server-validated totals on every
              order.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetaTile({ icon, label, value, mono, copyable }) {
  const Icon = icon;
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </p>
      <div className="mt-1 flex items-center gap-1">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            mono && "font-mono text-xs",
          )}
        >
          {value || "—"}
        </p>
        {copyable && value && <CopyButton value={value} />}
      </div>
    </div>
  );
}

function RequestBlock({ icon, label, data }) {
  const Icon = icon;
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-medium">
          <Icon className="size-4 text-muted-foreground" />
          {label}
        </span>
        <Badge variant="outline" className="capitalize">
          {prettify(data.status)}
        </Badge>
      </div>
      {data.reason && (
        <p className="mt-1.5 text-muted-foreground">Reason: {data.reason}</p>
      )}
      {data.detail && (
        <p className="mt-0.5 text-xs text-muted-foreground">{data.detail}</p>
      )}
      {data.rejectionReason && (
        <p className="mt-0.5 text-xs text-destructive">
          {data.rejectionReason}
        </p>
      )}
      {data.amount > 0 && (
        <p className="mt-0.5 text-xs text-muted-foreground">
          Amount: {formatMoney(data.amount)}
        </p>
      )}
      {data.requestedAt && (
        <p className="mt-0.5 text-xs text-muted-foreground">
          Requested {formatDateTime(data.requestedAt)}
        </p>
      )}
    </div>
  );
}

function StateCard({ icon, title, description, children }) {
  const Icon = icon;
  return (
    <Card className="mx-auto max-w-lg shadow-none">
      <CardContent className="p-0">
        <Empty className="border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon className="size-5" />
            </EmptyMedia>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>{description}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            {children}
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}

function OrderLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <Card className="shadow-none">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
