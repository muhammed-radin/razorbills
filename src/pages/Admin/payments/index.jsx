import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Truck, RefreshCw, DollarSign, PackageX, PackageCheck, Undo2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ordersApi, paymentsApi, shipmentsApi } from "@/services/shop";

const inr = (n) => `₹${Number(n ?? 0).toFixed(2)}`;

function OrderRow({ order, actions }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border p-3 sm:p-4">
      <div className="min-w-0 flex-1">
        <p className="font-mono font-semibold text-primary text-sm">{order.id ?? order._id}</p>
        <p className="text-xs text-muted-foreground">
          {(order.products ?? []).length} item(s) · {order.payment?.method} ({order.payment?.status})
          {order.payment?.codStatus ? ` · COD ${order.payment.codStatus}` : ""} ·{" "}
          {order.fulfillment?.status}
          {order.fulfillment?.awb ? ` · AWB ${order.fulfillment.awb}` : ""}
        </p>
      </div>
      <p className="font-bold">{inr(order.totalAmount)}</p>
      <div className="flex flex-wrap gap-2">{actions}</div>
    </div>
  );
}

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const load = async (which = tab) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      let data;
      if (which === "pending") data = await ordersApi.pending();
      else if (which === "processing") data = await ordersApi.processing();
      else if (which === "returns") data = await ordersApi.returns();
      else if (which === "refunds") data = await ordersApi.refunds();
      const list = data?.orders ?? (Array.isArray(data) ? data : []);
      setOrders(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error loading payment queues:", error);
      setOrders([]);
      setLoadError(
        error?.response?.status === 403
          ? "Admin access required to view payments."
          : "Could not load payment queues. Check the connection and retry.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const run = async (id, label, fn) => {
    if (busyId) return;
    try {
      setBusyId(id + label);
      await fn();
      toast.success(label);
      await load();
    } catch (error) {
      console.error(label, error);
      toast.error(error?.response?.data?.error ?? `Failed: ${label}`);
    } finally {
      setBusyId(null);
    }
  };

  const collectCod = (o) => run(o.id, "COD collected", () => paymentsApi.collectCod(o.id, o.totalAmount));
  const createShipment = (o) => run(o.id, "Shipment creation requested", () => shipmentsApi.create(o.id, {}));
  const trackShipment = async (o) => {
    try {
      setBusyId(o.id + "track");
      const resp = await shipmentsApi.track(o.id);
      if (resp?.trackingUrl) window.open(resp.trackingUrl, "_blank", "noopener,noreferrer");
      else toast.success(resp?.awb ? `Tracking synced: ${resp.awb}` : "Tracking synced");
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.error ?? "Tracking sync failed");
    } finally {
      setBusyId(null);
    }
  };
  const approveReturn = (o) => run(o.id, "Return approved", () => ordersApi.approveReturn(o.id));
  const completeRefund = (o) =>
    run(o.id, "Refund completed", () =>
      ordersApi.completeRefund(o.id, `ADMIN-${Date.now()}`),
    );

  const counts = { pending: 0, processing: 0, returns: 0, refunds: 0 };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="font-semibold">Loading Payments & Shipping</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {loadError && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <span className="flex-1 text-destructive">{loadError}</span>
            <Button onClick={() => load()} variant="outline" size="sm">Retry</Button>
          </div>
        )}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 p-4 sm:p-6 md:p-8 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Payments & Shipping</h1>
                <p className="text-white/80 text-sm mt-1">COD collection, refunds, returns & shipments</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => load()} className="bg-white/20 text-white hover:bg-white/30 border-0">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50 gap-1">
            <TabsTrigger value="pending" className="py-2 text-xs sm:text-sm">
              <PackageX className="h-3.5 w-3.5 mr-1 hidden sm:inline" /> Pending
            </TabsTrigger>
            <TabsTrigger value="processing" className="py-2 text-xs sm:text-sm">
              <PackageCheck className="h-3.5 w-3.5 mr-1 hidden sm:inline" /> Processing
            </TabsTrigger>
            <TabsTrigger value="returns" className="py-2 text-xs sm:text-sm">
              <Undo2 className="h-3.5 w-3.5 mr-1 hidden sm:inline" /> Returns
            </TabsTrigger>
            <TabsTrigger value="refunds" className="py-2 text-xs sm:text-sm">
              <Wallet className="h-3.5 w-3.5 mr-1 hidden sm:inline" /> Refunds
            </TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-4">
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="capitalize">{tab} queue</CardTitle>
                <CardDescription>
                  {orders.length} order(s) · {counts[tab] ?? ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {orders.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">
                    <Truck className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">Queue is empty</p>
                    <p className="text-sm">No {tab} orders right now — a good sign.</p>
                  </div>
                ) : (
                  orders.map((o) => {
                    const id = o.id ?? o._id;
                    const busy = busyId?.startsWith(id);
                    const isCod = o.payment?.method === "cod";
                    return (
                      <OrderRow
                        key={id}
                        order={o}
                        actions={
                          <>
                            {isCod && o.payment?.codStatus === "pending_collection" && (
                              <Button size="sm" disabled={busy} onClick={() => collectCod(o)}>
                                <DollarSign className="h-3.5 w-3.5 mr-1" /> Collect COD
                              </Button>
                            )}
                            <Button size="sm" variant="outline" disabled={busy} onClick={() => createShipment(o)}>
                              <Truck className="h-3.5 w-3.5 mr-1" /> Create Shipment
                            </Button>
                            {o.fulfillment?.awb && (
                              <Button size="sm" variant="outline" disabled={busy} onClick={() => trackShipment(o)}>
                                Track
                              </Button>
                            )}
                            {tab === "returns" && (
                              <Button size="sm" variant="outline" disabled={busy} onClick={() => approveReturn(o)}>
                                Approve Return
                              </Button>
                            )}
                            {tab === "refunds" && (
                              <Button size="sm" disabled={busy} onClick={() => completeRefund(o)}>
                                Complete Refund
                              </Button>
                            )}
                            <Badge variant="outline" className="capitalize">{o.status}</Badge>
                          </>
                        }
                      />
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
