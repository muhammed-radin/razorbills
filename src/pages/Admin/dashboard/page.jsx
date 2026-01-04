import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  MoreHorizontal,
  Sparkles,
  Activity,
  CreditCard,
  Calendar,
  RefreshCcw,
} from "lucide-react";
import axios from "axios";
import { api } from "@/utils/api";
import { Pie, PieChart, Cell, ResponsiveContainer, Area, AreaChart, Line, LineChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export const description = "A beautiful admin dashboard"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "#22c55e" },
  { browser: "safari", visitors: 200, fill: "#3b82f6" },
  { browser: "firefox", visitors: 187, fill: "#f97316" },
  { browser: "edge", visitors: 173, fill: "#8b5cf6" },
  { browser: "other", visitors: 90, fill: "#ec4899" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "#22c55e",
  },
  safari: {
    label: "Safari",
    color: "#3b82f6",
  },
  firefox: {
    label: "Firefox",
    color: "#f97316",
  },
  edge: {
    label: "Edge",
    color: "#8b5cf6",
  },
  other: {
    label: "Other",
    color: "#ec4899",
  },
}

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#8b5cf6",
  },
  orders: {
    label: "Orders",
    color: "#22c55e",
  },
}

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartDataA = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const revenueData = [
  { month: "Jan", revenue: 4500, orders: 120 },
  { month: "Feb", revenue: 5200, orders: 145 },
  { month: "Mar", revenue: 4800, orders: 132 },
  { month: "Apr", revenue: 6100, orders: 178 },
  { month: "May", revenue: 5800, orders: 165 },
  { month: "Jun", revenue: 7200, orders: 210 },
]

const chartConfigA = {
  desktop: {
    label: "Desktop",
    color: "#6366f1",
  },
  mobile: {
    label: "Mobile",
    color: "#22d3ee",
  },
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const DEFAULT_PRODUCT_COUNT = 0;

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(api.products())
      .then((response) => {
        setProducts(response.data.products || response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,678",
      icon: DollarSign,
      change: "+15.3%",
      changeType: "positive",
      description: "vs last month",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-600/10",
    },
    {
      title: "Total Orders",
      value: "1,234",
      icon: ShoppingCart,
      change: "+8.2%",
      changeType: "positive",
      description: "vs last month",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-600/10",
    },
    {
      title: "Total Products",
      value: products.length || DEFAULT_PRODUCT_COUNT,
      icon: Package,
      change: "+12.5%",
      changeType: "positive",
      description: "active products",
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-500/10 to-purple-600/10",
    },
    {
      title: "Total Customers",
      value: "892",
      icon: Users,
      change: "+23.1%",
      changeType: "positive",
      description: "new this month",
      gradient: "from-orange-500 to-rose-600",
      bgGradient: "from-orange-500/10 to-rose-600/10",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      product: "Arduino Uno",
      amount: "$25.99",
      status: "Delivered",
      date: "2 hours ago",
      avatar: "JD",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      product: "Raspberry Pi 4",
      amount: "$55.00",
      status: "Shipped",
      date: "4 hours ago",
      avatar: "JS",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      email: "mike@example.com",
      product: "ESP32 Module",
      amount: "$12.50",
      status: "Processing",
      date: "6 hours ago",
      avatar: "MJ",
    },
    {
      id: "ORD-004",
      customer: "Sarah Williams",
      email: "sarah@example.com",
      product: "LED Strip 5m",
      amount: "$18.99",
      status: "Delivered",
      date: "8 hours ago",
      avatar: "SW",
    },
    {
      id: "ORD-005",
      customer: "David Brown",
      email: "david@example.com",
      product: "Breadboard Kit",
      amount: "$9.99",
      status: "Pending",
      date: "12 hours ago",
      avatar: "DB",
    },
  ];

  const recentActivity = [
    { type: "order", message: "New order #ORD-006 received", time: "2 min ago", icon: ShoppingCart },
    { type: "user", message: "New user registered: Alex Turner", time: "15 min ago", icon: Users },
    { type: "product", message: "Product 'Arduino Nano' is low on stock", time: "1 hour ago", icon: AlertCircle },
    { type: "payment", message: "Payment confirmed for order #ORD-005", time: "2 hours ago", icon: CreditCard },
    { type: "review", message: "New 5-star review on 'Raspberry Pi 4'", time: "3 hours ago", icon: Sparkles },
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case "Delivered":
        return { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 };
      case "Shipped":
        return { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Package };
      case "Processing":
        return { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: RefreshCcw };
      case "Pending":
        return { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", icon: Clock };
      default:
        return { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", icon: AlertCircle };
    }
  };

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
              <span className="text-sm font-medium text-white/80">Welcome back!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Good morning, Admin! 👋
            </h1>
            <p className="text-white/80 max-w-md">
              Here's what's happening with your store today. You have <span className="font-semibold text-white">12 new orders</span> waiting.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 text-white">
              <Eye className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button className="bg-white text-purple-700 hover:bg-white/90">
              <Package className="h-4 w-4 mr-2" />
              Add Product
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
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-50`} />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {metric.change}
                      </span>
                      <span className="text-xs text-muted-foreground">{metric.description}</span>
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart - Takes 2 columns */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue and orders trend</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Last 6 months
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[250px] sm:h-[300px] w-full">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value}`} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="h-8">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Orders Table & Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders - Takes 2 columns */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
              <CardDescription>Latest customer orders and their status</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All Orders
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {order.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.product}</p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold">{order.amount}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {order.status}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
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
                <span className="text-sm font-medium">Conversion Rate</span>
                <span className="text-sm font-bold text-emerald-600">3.24%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[32.4%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg. Order Value</span>
                <span className="text-sm font-bold text-blue-600">$127.50</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="text-sm font-bold text-violet-600">94.8%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[94.8%] rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Low Stock Alert</p>
                    <p className="text-xs text-muted-foreground">12 products</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-amber-600 hover:text-amber-700">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Users</p>
                    <p className="text-xs text-muted-foreground">247 online</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:text-emerald-700">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Browser Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px] sm:max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
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
              {chartData.map((item) => (
                <div key={item.browser} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-xs text-muted-foreground capitalize">{item.browser}</span>
                  <span className="text-xs font-semibold ml-auto">{item.visitors}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Analytics */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Device Analytics</CardTitle>
            <CardDescription>Desktop vs Mobile traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigA} className="h-[200px] sm:h-[250px] w-full">
              <BarChart accessibilityLayer data={chartDataA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="desktop" fill="url(#colorDesktop)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="mobile" fill="url(#colorMobile)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
                <span className="text-xs text-muted-foreground">Desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-cyan-400" />
                <span className="text-xs text-muted-foreground">Mobile</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
            <div className="flex gap-2 leading-none font-medium">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Trending up by 5.2% this month
            </div>
            <div className="text-muted-foreground leading-none">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>

        {/* Top Products */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Top Products</CardTitle>
            <CardDescription>Best selling items this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Raspberry Pi 4", sales: 142, revenue: "$7,810", trend: "+12%" },
              { name: "Arduino Uno R3", sales: 98, revenue: "$2,548", trend: "+8%" },
              { name: "ESP32 Module", sales: 87, revenue: "$1,087", trend: "+15%" },
              { name: "LED Strip 5m", sales: 76, revenue: "$1,443", trend: "+5%" },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-violet-600">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{product.revenue}</p>
                  <p className="text-xs text-emerald-600">{product.trend}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
