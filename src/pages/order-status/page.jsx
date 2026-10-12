import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { OrderSummary1 } from "@/components/order-summary1";
import { useOrderStore } from "@/stores/shop";
import { paymentsApi, shipmentsApi } from "@/services/shop";
import { loadRazorpayCheckout, openRazorpayCheckout } from "@/utils/razorpay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function OrderStatusPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const rawId = params.get("id");
  // Validate the query parameter: accept internal ORD- ids only.
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

  const order = useMemo(() => {
    if (!orderId || !detail) return undefined;
    const products = detail.products ?? [];
    const subtotal = products.reduce(
      (sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 1),
      0,
    );
    return {
      orderNumber: detail.id ?? detail._id ?? orderId,
      orderDate: detail.createdAt
        ? new Date(detail.createdAt).toLocaleDateString()
        : "",
      status: detail.status ?? "pending",
      email: detail.userEmail ?? detail.email ?? "",
      items: products.map((p, i) => ({
        id: p.productId ?? String(i),
        name: p.title ?? "Product",
        image: p.thumbnail ?? "",
        price: p.price ?? 0,
        quantity: p.quantity ?? 1,
        details: [
          { label: "SKU", value: p.sku ?? "—" },
          { label: "Category", value: p.category ?? "—" },
        ],
      })),
      subtotal,
      shipping: detail.shippingAmount ?? 0,
      tax: detail.taxAmount ?? 0,
      discount: detail.discount?.amount ?? 0,
      total: detail.totalAmount ?? subtotal,
      shippingAddress: {
        name: detail.shippingAddress?.name ?? "",
        street:
          detail.shippingAddress?.address ??
          detail.shippingAddress?.street ??
          "",
        city: detail.shippingAddress?.city ?? "",
        state: detail.shippingAddress?.state ?? "",
        zipCode:
          detail.shippingAddress?.pincode ??
          detail.shippingAddress?.zipCode ??
          "",
        country: detail.shippingAddress?.country ?? "India",
      },
      shippingMethod: detail.shippingMethod ?? "Standard Shipping",
      estimatedDelivery: detail.estimatedDelivery ?? "",
      paymentMethod: {
        type: detail.payment?.method ?? "upi",
        lastFour: "",
        cardBrand: "",
      },
    };
  }, [orderId, detail]);

  return (
    <>
      <Helmet>
        <title>{t("orderStatus.pageTitle")}</title>
        <meta name="description" content={t("orderStatus.pageDescription")} />
      </Helmet>
      <div className="container flex flex-col mx-auto items-center px-4 py-8 gap-6">
        {!orderId ? (
          <Card className="max-w-lg w-full">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No order selected.{" "}
              <Link to="/order" className="text-primary underline">
                View your orders
              </Link>
              .
            </CardContent>
          </Card>
        ) : idInvalid ? (
          <Card className="max-w-lg w-full">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              That order link looks invalid.{" "}
              <Link to="/order" className="text-primary underline">
                View your orders
              </Link>
              .
            </CardContent>
          </Card>
        ) : loading && !detail ? (
          <Card className="max-w-lg w-full">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Loading order…
            </CardContent>
          </Card>
        ) : !detail ? (
          <Card className="max-w-lg w-full">
            <CardContent className="space-y-3 py-8 text-center text-sm text-muted-foreground">
              <p>
                {storeError?.response?.status === 403
                  ? "This order belongs to another account."
                  : "Order not found or you don't have access."}
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => orderId && fetchDetail(orderId).catch(() => {})}
                >
                  Retry
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link to="/order">My orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <OrderSummary1 order={order} />
            <PaymentShipmentPanel
              detail={detail}
              orderId={orderId}
              retrying={retrying}
              setRetrying={setRetrying}
              fetchDetail={fetchDetail}
              tracking={tracking}
              setTracking={setTracking}
              trackingLoading={trackingLoading}
              setTrackingLoading={setTrackingLoading}
            />
          </>
        )}
      </div>
    </>
  );
}

function PaymentShipmentPanel({
  detail,
  orderId,
  retrying,
  setRetrying,
  fetchDetail,
  tracking,
  setTracking,
  trackingLoading,
  setTrackingLoading,
}) {
  const pay = detail?.payment ?? {};
  const ful = detail?.fulfillment ?? {};
  const isCod = pay.method === "cod";
  const canRetry =
    !isCod && ["pending", "failed"].includes(pay.status);

  const retryPayment = async () => {
    setRetrying(true);
    try {
      const init = await paymentsApi.createRazorpay(orderId);
      await loadRazorpayCheckout();
      openRazorpayCheckout({
        keyId: init.keyId ?? import.meta.env.VITE_RAZORPAY_KEY_ID,
        razorpayOrderId: init.razorpayOrderId,
        amountInr: init.amount ?? detail?.totalAmount,
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
          } catch { /* intentional no-op */ }
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
    setTrackingLoading(true);
    try {
      const resp = await shipmentsApi.track(orderId);
      setTracking(resp);
    } catch (err) {
      toast.error(err?.response?.data?.error ?? "Tracking sync failed");
    } finally {
      setTrackingLoading(false);
    }
  };

  const awb = ful.awb ?? ful.trackingNumber;
  const history = tracking?.history ?? ful.history ?? [];
  const cancellation = detail?.cancellation ?? {};
  const ret = detail?.return ?? {};
  const hasRequests =
    (cancellation.status && cancellation.status !== "none") ||
    (ret.status && ret.status !== "none");

  return (
    <div className="w-full max-w-3xl grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Method</span>
            <span className="font-medium">
              {isCod ? "Cash on Delivery" : "Razorpay (prepaid)"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline">{pay.status ?? "pending"}</Badge>
          </div>
          {isCod && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Collection</span>
              <Badge variant="outline">
                {pay.codStatus ?? "pending_collection"}
              </Badge>
            </div>
          )}
          {pay.razorpayPaymentId && (
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Payment ID</span>
              <span className="font-mono text-xs truncate max-w-[180px]">
                {pay.razorpayPaymentId}
              </span>
            </div>
          )}
          {pay.failureReason && (
            <p className="text-xs text-destructive">{pay.failureReason}</p>
          )}
          {canRetry && (
            <Button
              size="sm"
              className="w-full mt-2"
              disabled={retrying}
              onClick={retryPayment}
            >
              {retrying ? "Opening Razorpay…" : "Retry payment"}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shipping</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order status</span>
            <Badge variant="outline">{detail?.status}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fulfillment</span>
            <Badge variant="outline">{ful.status ?? "unfulfilled"}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Courier</span>
            <span className="font-medium">{ful.courierName ?? "—"}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">AWB / Tracking</span>
            <span className="font-mono text-xs">{awb ?? "Not assigned yet"}</span>
          </div>
          {history.length > 0 && (
            <ul className="pt-1 space-y-1 max-h-32 overflow-auto text-xs text-muted-foreground">
              {[...history].reverse().slice(0, 10).map((h, i) => (
                <li key={i} className="border-l-2 border-muted pl-2">
                  <span className="font-medium text-foreground">
                    {h.status ?? "update"}
                  </span>
                  {h.message ? ` — ${h.message}` : ""}
                  {h.timestamp
                    ? ` (${new Date(h.timestamp).toLocaleString()})`
                    : ""}
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              disabled={trackingLoading || !awb}
              onClick={refreshTracking}
            >
              {trackingLoading ? "Syncing…" : "Refresh tracking"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              disabled={!awb && !ful.trackingUrl}
              asChild={Boolean(awb || ful.trackingUrl)}
            >
              {awb || ful.trackingUrl ? (
                <a
                  href={ful.trackingUrl ?? "https://panel.shipmozo.com/track-order"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Track Shipment
                </a>
              ) : (
                <span>No tracking yet</span>
              )}
            </Button>
          </div>
          {tracking?.stub && (
            <p className="text-xs text-muted-foreground">
              Live tracking unavailable — Shipmozo not configured.
            </p>
          )}
        </CardContent>
      </Card>

      {hasRequests && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Requests</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            {cancellation.status && cancellation.status !== "none" && (
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">Cancellation</span>
                  <Badge variant="outline">{cancellation.status}</Badge>
                </div>
                {cancellation.reason && (
                  <p className="mt-1 text-muted-foreground">
                    Reason: {cancellation.reason}
                  </p>
                )}
                {cancellation.detail && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {cancellation.detail}
                  </p>
                )}
                {cancellation.requestedAt && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Requested {new Date(cancellation.requestedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
            {ret.status && ret.status !== "none" && (
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">Return</span>
                  <Badge variant="outline">{ret.status}</Badge>
                </div>
                {ret.reason && (
                  <p className="mt-1 text-muted-foreground">
                    Reason: {ret.reason}
                  </p>
                )}
                {ret.detail && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {ret.detail}
                  </p>
                )}
                {ret.requestedAt && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Requested {new Date(ret.requestedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
