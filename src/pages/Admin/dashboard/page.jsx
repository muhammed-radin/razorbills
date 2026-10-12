import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  MoreHorizontal,
  Sparkles,
  Activity,
  CreditCard,
  Calendar,
  RefreshCcw,
} from "lucide-react";
import { api } from "@/utils/api";
import { decryptField } from "@/utils/crypt";
import {
  Pie,
  PieChart,
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import AvatarIcon from "@/components/avatar-icon";

export const description = "A beautiful admin dashboard";

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#8b5cf6",
  },
  orders: {
    label: "Orders",
    color: "#22c55e",
  },
};

const BROWSER_COLORS = {
  chrome: "#22c55e",
  safari: "#3b82f6",
  firefox: "#f97316",
  edge: "#8b5cf6",
  other: "#ec4899",
};

const trafficChartConfig = {
  visitors: { label: "Visitors" },
  ...Object.fromEntries(
    Object.entries(BROWSER_COLORS).map(([k, color]) => [
      k,
      { label: k[0].toUpperCase() + k.slice(1), color },
    ]),
  ),
};

const deviceChartConfig = {
  desktop: { label: "Desktop", color: "#6366f1" },
  mobile: { label: "Mobile", color: "#22d3ee" },
};

const inr = (n) =>
  `₹${Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);
  const [customerCount, setCustomerCount] = useState(null);
  const [lowStock, setLowStock] = useState(null);
  const [siteStats, setSiteStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [granularity, setGranularity] = useState("day");
  const [errors, setErrors] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const fail = useCallback((key, err) => {
    console.error(`Dashboard widget failed (${key}):`, err);
    setErrors((e) => ({
      ...e,
      [key]:
        err?.response?.status === 403
          ? "Admin access required."
          : err?.response?.status === 404
            ? "No data recorded yet."
            : "Could not load this widget.",
    }));
  }, []);

  const loadAll = useCallback(
    async (gran = granularity) => {
      setRefreshing(true);
      const { analyticsApi, ordersApi, usersApi, productsApi } = await import(
        "@/services/shop"
      );
      const tasks = [
        (async () => {
          try {
            const res = await api.client.get(api.products(), {
              params: { limit: 1, realtime: "true" },
            });
            const list = res.data?.products ?? res.data ?? [];
            setProducts(Array.isArray(list) ? list : []);
            setProductCount(
              typeof res.data?.count === "number"
                ? res.data.count
                : Array.isArray(list)
                  ? list.length
                  : null,
            );
          } catch (err) {
            fail("products", err);
          }
        })(),
        (async () => {
          try {
            const s = await analyticsApi.ordersSummary({ granularity: gran });
            setSummary(s);
          } catch (err) {
            fail("summary", err);
          }
        })(),
        (async () => {
          try {
            const data = await ordersApi.list({
              limit: 5,
              sortBy: "createdAt",
              sortOrder: "desc",
            });
            const list = data?.orders ?? (Array.isArray(data) ? data : []);
            setLiveOrders(Array.isArray(list) ? list : []);
          } catch (err) {
            fail("orders", err);
          }
        })(),
        (async () => {
          try {
            const data = await usersApi.list({ limit: 1 });
            setCustomerCount(
              typeof data?.count === "number" ? data.count : null,
            );
          } catch (err) {
            fail("customers", err);
          }
        })(),
        (async () => {
          try {
            const s = await productsApi.status();
            const low = Array.isArray(s?.lowStock)
              ? s.lowStock.length
              : typeof s?.lowStockCount === "number"
                ? s.lowStockCount
                : typeof s?.lowStock === "number"
                  ? s.lowStock
                  : null;
            setLowStock(low);
          } catch (err) {
            fail("stock", err);
          }
        })(),
        (async () => {
          try {
            const g = await analyticsApi.global();
            setSiteStats(g);
          } catch (err) {
            fail("traffic", err);
          }
        })(),
        (async () => {
          try {
            const data = await ordersApi.list({ limit: 100 });
            const list = data?.orders ?? (Array.isArray(data) ? data : []);
            const agg = new Map();
            for (const o of Array.isArray(list) ? list : []) {
              if (o?.status === "cancelled") continue;
              const paid = o?.payment?.status === "paid";
              for (const p of o?.products ?? []) {
                const key = p?.productId ?? p?.title ?? "unknown";
                const cur = agg.get(key) ?? {
                  name: p?.title ?? "Unknown product",
                  sales: 0,
                  revenue: 0,
                };
                cur.sales += Number(p?.quantity ?? 1);
                if (paid) cur.revenue += Number(p?.price ?? 0) * Number(p?.quantity ?? 1);
                agg.set(key, cur);
              }
            }
            setTopProducts(
              [...agg.values()].sort((a, b) => b.sales - a.sales).slice(0, 4),
            );
          } catch (err) {
            fail("top", err);
          }
        })(),
      ];
      await Promise.allSettled(tasks);
      setIsLoading(false);
      setRefreshing(false);
    },
    [fail], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    setIsLoading(true);
    loadAll("day");
  }, [loadAll]);

  const changeGranularity = (g) => {
    setGranularity(g);
    setErrors((e) => ({ ...e, summary: undefined }));
    import("@/services/shop").then(({ analyticsApi }) =>
      analyticsApi
        .ordersSummary({ granularity: g })
        .then(setSummary)
        .catch((err) => fail("summary", err)),
    );
  };

  const metrics = [
    {
      title: "Total Revenue (verified paid)",
      value: summary ? inr(summary.payments?.revenue) : errors.summary ?? "—",
      icon: DollarSign,
      change: summary
        ? `${summary.payments?.paidOrders ?? 0} paid orders`
        : (errors.summary ?? "loading…"),
      changeType: "positive",
      description: summary?.definitions?.revenue ?? "paid orders only",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-600/10",
    },
    {
      title: "Total Orders",
      value: summary ? String(summary.totals?.orders ?? 0) : errors.summary ?? "—",
      icon: ShoppingCart,
      change: summary
        ? `AOV ${summary.payments?.aov !== null && summary.payments?.aov !== undefined ? inr(summary.payments.aov) : "—"}`
        : (errors.summary ?? "loading…"),
      changeType: "positive",
      description: "all statuses in range",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-600/10",
    },
    {
      title: "Total Products",
      value: productCount ?? (products.length || "—"),
      icon: Package,
      change: errors.products ?? (lowStock !== null && lowStock !== undefined ? `${lowStock} low-stock` : "live inventory"),
      changeType: "positive",
      description: "active products",
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-500/10 to-purple-600/10",
    },
    {
      title: "Total Customers",
      value: customerCount ?? errors.customers ?? "—",
      icon: Users,
      change: summary ? `COD pending ${inr(summary.cod?.pendingCollection)}` : (errors.summary ?? "loading…"),
      changeType: "positive",
      description: summary
        ? `COD collected ${inr(summary.cod?.collected)}`
        : "live COD exposure",
      gradient: "from-orange-500 to-rose-600",
      bgGradient: "from-orange-500/10 to-rose-600/10",
    },
  ];

  const recentOrders = liveOrders.map((o) => ({
    id: o.id ?? o._id,
    customer:
      o.shippingAddress?.name ??
      decryptField(o.userName) ??
      o.userId ??
      "Customer",
    email: o.shippingAddress?.email ?? o.userEmail ?? "",
    product: o.products?.[0]?.title ?? `${o.products?.length ?? 0} item(s)`,
    amount: `₹${Number(o.totalAmount ?? 0).toFixed(2)}`,
    status: ({
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      confirmed: "Processing",
      cancelled: "Cancelled",
    })[o.status] ?? o.status,
    date: o.createdAt ? new Date(o.createdAt).toLocaleString() : "",
    avatar: (o.shippingAddress?.name ?? o.id ?? "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  }));

  const revenueData = (summary?.series ?? []).map((b) => ({
    month: new Date(b.bucket).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    revenue: b.revenue,
    orders: b.orders,
  }));

  const recentActivity = liveOrders.slice(0, 5).map((o) => ({
    type: "order",
    message: `Order ${o.id} · ${o.status} · ₹${Number(o.totalAmount ?? 0).toFixed(2)}`,
    time: o.createdAt ? new Date(o.createdAt).toLocaleString() : "",
    icon: ShoppingCart,
  }));

  const traffic = siteStats?.traffic ?? null;
  const browserData = traffic
    ? [
        { browser: "chrome", visitors: traffic.sources?.chrome ?? traffic.browsers?.chrome ?? 0, fill: BROWSER_COLORS.chrome },
        { browser: "safari", visitors: traffic.sources?.safari ?? traffic.browsers?.safari ?? 0, fill: BROWSER_COLORS.safari },
        { browser: "firefox", visitors: traffic.sources?.firefox ?? traffic.browsers?.firefox ?? 0, fill: BROWSER_COLORS.firefox },
        { browser: "edge", visitors: traffic.sources?.edge ?? traffic.browsers?.edge ?? 0, fill: BROWSER_COLORS.edge },
        { browser: "other", visitors: traffic.sources?.other ?? traffic.browsers?.other ?? 0, fill: BROWSER_COLORS.other },
      ]
    : [];

  const deviceData = traffic?.devices
    ? [{ month: "All time", desktop: traffic.devices.desktop ?? 0, mobile: traffic.devices.mobile ?? 0 }]
    : [];

  const getStatusConfig = (status) => {
    switch (status) {
      case "Delivered":
        return {
          color:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
          icon: CheckCircle2,
        };
      case "Shipped":
        return {
          color:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          icon: Package,
        };
      case "Processing":
        return {
          color:
            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          icon: RefreshCcw,
        };
      case "Pending":
        return {
          color:
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
          icon: Clock,
        };
      default:
        return {
          color:
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
          icon: AlertCircle,
        };
    }
  };

  const aov = summary?.payments?.aov;
  const paidOrders = summary?.payments?.paidOrders ?? 0;
  const totalOrders = summary?.totals?.orders ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium text-white/80">
                Welcome back!
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Good morning, Admin! 👋
            </h1>
            <p className="text-white/80 max-w-md">
              Here&apos;s what&apos;s happening with your store today.
              {isLoading ? " Loading live metrics…" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 text-white"
              onClick={() => loadAll(granularity)}
              disabled={refreshing}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing…" : "Refresh"}
            </Button>
            <Button asChild className="bg-white text-purple-700 hover:bg-white/90">
              <Link to="/auth/admin/products/new">
                <Package className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.changeType === "positive";
          return (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-50`}
              />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                      {metric.value}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {metric.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {metric.description}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3 max-sm:grid-cols-1">
        {/* Revenue Chart - Takes 2 columns */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">
                Revenue Overview
              </CardTitle>
              <CardDescription>
                Verified-paid revenue and orders trend
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {(["day", "week", "month"]).map((g) => (
                <Button
                  key={g}
                  variant={granularity === g ? "default" : "outline"}
                  size="sm"
                  className="h-8 capitalize"
                  onClick={() => changeGranularity(g)}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {g}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {revenueData.length ? (
              <ChartContainer
                config={revenueChartConfig}
                className="h-[250px] sm:h-[300px] w-full"
              >
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                <TrendingUp className="h-8 w-8" />
                <p className="font-medium">No revenue data for this range</p>
                <p className="text-sm">{errors.summary ?? "Paid orders will appear here once verified."}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8" asChild>
                <Link to="/auth/admin/orders">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length ? (
              recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">No recent activity</p>
                <p className="text-sm">{errors.orders ?? "New orders will appear here."}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders Table & Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-3 max-sm:grid-cols-1">
        {/* Recent Orders - Takes 2 columns */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">
                Recent Orders
              </CardTitle>
              <CardDescription>
                Latest customer orders and their status
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth/admin/orders">View All Orders</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length ? (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <AvatarIcon
                          name={order.avatar}
                          decrypted={false}
                          size={40}
                        />
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.product}
                          </p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="font-semibold">{order.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.date}
                        </p>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {order.status}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to="/auth/admin/orders">
                          <MoreHorizontal className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">No orders yet</p>
                <p className="text-sm">{errors.orders ?? "Orders will appear here once customers check out."}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Stats</CardTitle>
            <CardDescription>Performance at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Paid Orders Share</span>
                <span className="text-sm font-bold text-emerald-600">
                  {totalOrders ? `${((paidOrders / totalOrders) * 100).toFixed(1)}%` : "—"}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ width: totalOrders ? `${Math.min(100, (paidOrders / totalOrders) * 100)}%` : "0%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {paidOrders} of {totalOrders} orders verified paid
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg. Order Value</span>
                <span className="text-sm font-bold text-blue-600">
                  {aov !== null && aov !== undefined ? inr(aov) : "—"}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              </div>
              <p className="text-xs text-muted-foreground">verified paid orders only</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  COD Outstanding
                </span>
                <span className="text-sm font-bold text-violet-600">
                  {summary ? inr(summary.cod?.pendingCollection) : "—"}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[40%] rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
              </div>
              <p className="text-xs text-muted-foreground">
                {summary ? `${summary.cod?.pendingCount ?? 0} awaiting collection · ${inr(summary.cod?.collected)} collected` : ""}
              </p>
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Low Stock Alert</p>
                    <p className="text-xs text-muted-foreground">
                      {lowStock ?? errors.stock ?? "…"} products
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-amber-600 hover:text-amber-700"
                  asChild
                >
                  <Link to="/auth/admin/products">View</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">COD Collected</p>
                    <p className="text-xs text-muted-foreground">
                      {summary ? inr(summary.cod?.collected) : "—"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-emerald-600 hover:text-emerald-700"
                  asChild
                >
                  <Link to="/auth/admin/orders">View</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-sm:grid-cols-1">
        {/* Browser Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Traffic Sources
            </CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent className="max-sm:max-w-[calc(100vw-2rem)]">
            {browserData.length && browserData.some((d) => d.visitors > 0) ? (
              <>
                <ChartContainer
                  config={trafficChartConfig}
                  className="mx-auto aspect-square max-h-[200px] sm:max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={browserData}
                      dataKey="visitors"
                      nameKey="browser"
                      innerRadius={50}
                      outerRadius={80}
                      strokeWidth={3}
                      stroke="#fff"
                    />
                  </PieChart>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {browserData.map((item) => (
                    <div key={item.browser} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-xs text-muted-foreground capitalize">
                        {item.browser}
                      </span>
                      <span className="text-xs font-semibold ml-auto">
                        {item.visitors}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                <Eye className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">No traffic data yet</p>
                <p className="text-sm">{errors.traffic ?? "Visitor analytics will appear once events are recorded."}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Analytics */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Device Analytics
            </CardTitle>
            <CardDescription>Desktop vs Mobile traffic</CardDescription>
          </CardHeader>
          <CardContent>
            {deviceData.length && (deviceData[0].desktop > 0 || deviceData[0].mobile > 0) ? (
              <>
                <ChartContainer
                  config={deviceChartConfig}
                  className="h-[200px] sm:h-[250px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={deviceData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke="#e5e7eb"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                    />
                    <ChartTooltip
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                      dataKey="desktop"
                      fill="url(#colorDesktop)"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="mobile"
                      fill="url(#colorMobile)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-indigo-500" />
                    <span className="text-xs text-muted-foreground">
                      Desktop ({deviceData[0].desktop})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-cyan-400" />
                    <span className="text-xs text-muted-foreground">
                      Mobile ({deviceData[0].mobile})
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">No device data yet</p>
                <p className="text-sm">{errors.traffic ?? "Device analytics will appear once events are recorded."}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
            <div className="flex gap-2 leading-none font-medium">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Live from site analytics
            </div>
            <div className="text-muted-foreground leading-none">
              {siteStats ? `Unique visitors: ${siteStats.traffic?.uniqueGuests ?? 0} guests · ${siteStats.traffic?.uniqueUsers ?? 0} users` : "Connect analytics to see trends"}
            </div>
          </CardFooter>
        </Card>

        {/* Top Products */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Top Products
            </CardTitle>
            <CardDescription>Best selling items from real orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.length ? (
              topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-violet-600">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{inr(product.revenue)}</p>
                    <p className="text-xs text-emerald-600">paid revenue</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">No sales data yet</p>
                <p className="text-sm">{errors.top ?? "Top products will appear once orders are placed."}</p>
              </div>
            )}
            {summary && Object.keys(summary.byStatus ?? {}).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.entries(summary.byStatus).map(([s, c]) => (
                  <Badge key={s} variant="secondary" className="capitalize">
                    {s}: {c}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
