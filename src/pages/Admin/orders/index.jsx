import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Package,
    Search,
    Filter,
    Download,
    Eye,
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    DollarSign,
    TrendingUp,
    Calendar,
    User,
    MapPin,
    Phone,
    Mail,
    MoreVertical,
    ChevronDown,
    RefreshCw,
    FileText,
    ArrowUpDown,
    ShoppingBag,
    Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { api } from "@/utils/api"
import axios from "axios"
import { cn } from "@/lib/utils"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const statusConfig = {
    pending: {
        label: "Pending",
        icon: Clock,
        color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
        dotColor: "bg-yellow-500",
    },
    processing: {
        label: "Processing",
        icon: RefreshCw,
        color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        dotColor: "bg-blue-500",
    },
    shipped: {
        label: "Shipped",
        icon: Truck,
        color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
        dotColor: "bg-purple-500",
    },
    delivered: {
        label: "Delivered",
        icon: CheckCircle2,
        color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
        dotColor: "bg-green-500",
    },
    cancelled: {
        label: "Cancelled",
        icon: XCircle,
        color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
        dotColor: "bg-red-500",
    },
}

// Form Schema for Edit Order
const editOrderFormSchema = z.object({
    orderId: z.string(),
    customerName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    customerEmail: z.string().email("Invalid email address"),
    customerPhone: z.string().min(10, "Phone number must be at least 10 characters"),
    shippingAddress: z.string().min(10, "Address must be at least 10 characters"),
    paymentMethod: z.string().min(2, "Payment method is required"),
})

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("date-desc")
    const [currentTab, setCurrentTab] = useState("all")

    // Sheet states
    const [editSheetOpen, setEditSheetOpen] = useState(false)
    const [statusSheetOpen, setStatusSheetOpen] = useState(false)
    const [cancelSheetOpen, setCancelSheetOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [newStatus, setNewStatus] = useState("")
    const [cancelReason, setCancelReason] = useState("")

    // Mock data - Replace with actual API calls
    const mockOrders = [
        {
            id: "ORD-2026-0001",
            customer: {
                name: "John Doe",
                email: "john.doe@example.com",
                phone: "+1 234 567 8900",
                avatar: "JD",
            },
            items: 3,
            total: 1299.99,
            status: "delivered",
            date: "2026-01-02",
            shippingAddress: "123 Main St, New York, NY 10001",
            paymentMethod: "Credit Card",
        },
        {
            id: "ORD-2026-0002",
            customer: {
                name: "Jane Smith",
                email: "jane.smith@example.com",
                phone: "+1 234 567 8901",
                avatar: "JS",
            },
            items: 1,
            total: 799.99,
            status: "shipped",
            date: "2026-01-03",
            shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
            paymentMethod: "PayPal",
        },
        {
            id: "ORD-2026-0003",
            customer: {
                name: "Bob Wilson",
                email: "bob.wilson@example.com",
                phone: "+1 234 567 8902",
                avatar: "BW",
            },
            items: 5,
            total: 2499.99,
            status: "processing",
            date: "2026-01-04",
            shippingAddress: "789 Pine Rd, Chicago, IL 60601",
            paymentMethod: "Credit Card",
        },
        {
            id: "ORD-2026-0004",
            customer: {
                name: "Alice Johnson",
                email: "alice.j@example.com",
                phone: "+1 234 567 8903",
                avatar: "AJ",
            },
            items: 2,
            total: 599.99,
            status: "pending",
            date: "2026-01-04",
            shippingAddress: "321 Elm St, Houston, TX 77001",
            paymentMethod: "Debit Card",
        },
        {
            id: "ORD-2026-0005",
            customer: {
                name: "Charlie Brown",
                email: "charlie.b@example.com",
                phone: "+1 234 567 8904",
                avatar: "CB",
            },
            items: 1,
            total: 299.99,
            status: "cancelled",
            date: "2026-01-03",
            shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
            paymentMethod: "Credit Card",
        },
    ]

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setIsLoading(true)
            // Replace with actual API call
            // const response = await axios.get(api.orders())
            // setOrders(response.data)

            // Using mock data for now
            setTimeout(() => {
                setOrders(mockOrders)
                setIsLoading(false)
            }, 1000)
        } catch (error) {
            console.error("Error fetching orders:", error)
            toast.error("Failed to load orders")
            setIsLoading(false)
        }
    }

    // Form for Edit Order Sheet
    const editOrderForm = useForm({
        resolver: zodResolver(editOrderFormSchema),
        defaultValues: {
            orderId: "",
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            shippingAddress: "",
            paymentMethod: "",
        },
    })

    // Handler functions for sheets
    const handleEditOrder = (order) => {
        setSelectedOrder(order)
        editOrderForm.reset({
            orderId: order.id,
            customerName: order.customer.name,
            customerEmail: order.customer.email,
            customerPhone: order.customer.phone,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
        })
        setEditSheetOpen(true)
    }

    const handleUpdateStatus = (order) => {
        setSelectedOrder(order)
        setNewStatus(order.status)
        setStatusSheetOpen(true)
    }

    const handleCancelOrder = (order) => {
        setSelectedOrder(order)
        setCancelReason("")
        setCancelSheetOpen(true)
    }

    const saveOrderEdit = async (values) => {
        try {
            // Replace with actual API call
            // await axios.put(api.orders(selectedOrder.id), values)

            // Update local state
            const updatedOrder = {
                ...selectedOrder,
                customer: {
                    ...selectedOrder.customer,
                    name: values.customerName,
                    email: values.customerEmail,
                    phone: values.customerPhone,
                },
                shippingAddress: values.shippingAddress,
                paymentMethod: values.paymentMethod,
            }
            setOrders(orders.map(o => o.id === selectedOrder.id ? updatedOrder : o))
            toast.success("Order updated successfully")
            setEditSheetOpen(false)
        } catch (error) {
            console.error("Error updating order:", error)
            toast.error("Failed to update order")
        }
    }

    const saveStatusUpdate = async () => {
        try {
            if (!newStatus) {
                toast.error("Please select a status")
                return
            }

            // Replace with actual API call
            // await axios.patch(api.orders(selectedOrder.id), { status: newStatus })

            // Update local state
            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
            toast.success(`Order status updated to ${statusConfig[newStatus].label}`)
            setStatusSheetOpen(false)
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Failed to update status")
        }
    }

    const confirmCancelOrder = async () => {
        try {
            if (!cancelReason.trim()) {
                toast.error("Please provide a reason for cancellation")
                return
            }

            // Replace with actual API call
            // await axios.patch(api.orders(selectedOrder.id), { status: "cancelled", cancelReason })

            // Update local state
            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: "cancelled" } : o))
            toast.success("Order cancelled successfully")
            setCancelSheetOpen(false)
        } catch (error) {
            console.error("Error cancelling order:", error)
            toast.error("Failed to cancel order")
        }
    }

    const getOrderStats = () => {
        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.status === "pending").length,
            processing: orders.filter(o => o.status === "processing").length,
            shipped: orders.filter(o => o.status === "shipped").length,
            delivered: orders.filter(o => o.status === "delivered").length,
            cancelled: orders.filter(o => o.status === "cancelled").length,
            revenue: orders.reduce((sum, o) => sum + o.total, 0),
        }
        return stats
    }

    const filteredOrders = orders
        .filter(order => {
            const matchesSearch =
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusFilter === "all" || order.status === statusFilter
            const matchesTab = currentTab === "all" || order.status === currentTab

            return matchesSearch && matchesStatus && matchesTab
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "date-desc":
                    return new Date(b.date) - new Date(a.date)
                case "date-asc":
                    return new Date(a.date) - new Date(b.date)
                case "amount-desc":
                    return b.total - a.total
                case "amount-asc":
                    return a.total - b.total
                default:
                    return 0
            }
        })

    const stats = getOrderStats()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                        <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg sm:text-xl font-semibold text-foreground mb-1">Loading Orders</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Please wait while we fetch the data...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8">
                {/* Beautiful Hero Header */}
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 p-4 sm:p-6 md:p-8 text-white shadow-2xl">
                    <div className="absolute -top-32 -right-32 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-32 -left-32 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Orders Management</h1>
                                <p className="text-white/80 text-sm sm:text-base md:text-lg mt-1">
                                    Track and manage all customer orders
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
                            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-white/70 truncate">Total Orders</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold">{stats.total}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-white/70 truncate">Pending</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold">{stats.pending}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-white/70 truncate">Shipped</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold">{stats.shipped}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-white/70 truncate">Revenue</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <Card className="border-2 shadow-lg">
                    <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 sm:h-11 border-2 focus-visible:border-primary text-sm sm:text-base"
                                />
                            </div>
                            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="h-10 sm:h-11 border-2 text-xs sm:text-sm">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="h-10 sm:h-11 border-2 text-xs sm:text-sm">
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date-desc">Newest First</SelectItem>
                                        <SelectItem value="date-asc">Oldest First</SelectItem>
                                        <SelectItem value="amount-desc">Highest Amount</SelectItem>
                                        <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="h-10 sm:h-11 px-4 sm:px-6 shadow-lg col-span-2 sm:col-span-1 text-xs sm:text-sm">
                                    <Download className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Tabs */}
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-muted/50 gap-1">
                        <TabsTrigger value="all" className="flex flex-col items-center gap-1 py-2 sm:py-3 text-xs sm:text-sm">
                            <span className="font-semibold">All</span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2">{stats.total}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="flex flex-col items-center gap-1 py-2 sm:py-3 text-xs sm:text-sm">
                            <span className="font-semibold hidden sm:inline">Pending</span>
                            <span className="font-semibold sm:hidden">Pend</span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 bg-yellow-500/20 text-yellow-700">{stats.pending}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="processing" className="flex flex-col items-center gap-1 py-2 sm:py-3 text-xs sm:text-sm">
                            <span className="font-semibold hidden sm:inline">Processing</span>
                            <span className="font-semibold sm:hidden">Proc</span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 bg-blue-500/20 text-blue-700">{stats.processing}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="shipped" className="flex flex-col items-center gap-1 py-2 sm:py-3 text-xs sm:text-sm">
                            <span className="font-semibold hidden sm:inline">Shipped</span>
                            <span className="font-semibold sm:hidden">Ship</span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 bg-purple-500/20 text-purple-700">{stats.shipped}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="delivered" className="flex flex-col items-center gap-1 py-2 sm:py-3 text-xs sm:text-sm">
                            <span className="font-semibold hidden sm:inline">Delivered</span>
                            <span className="font-semibold sm:hidden">Deliv</span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 bg-green-500/20 text-green-700">{stats.delivered}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="cancelled" className="flex flex-col items-center gap-1 py-2 sm:py-3 text-xs sm:text-sm">
                            <span className="font-semibold hidden sm:inline">Cancelled</span>
                            <span className="font-semibold sm:hidden">Canc</span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 bg-red-500/20 text-red-700">{stats.cancelled}</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={currentTab} className="mt-4 sm:mt-6">
                        {/* Mobile Card View */}
                        <div className="block lg:hidden space-y-3 sm:space-y-4">
                            {filteredOrders.length === 0 ? (
                                <Card className="border-2 shadow-xl">
                                    <CardContent className="py-8 sm:py-12">
                                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-muted flex items-center justify-center">
                                                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-base sm:text-lg">No orders found</p>
                                                <p className="text-xs sm:text-sm text-muted-foreground">Try adjusting your search or filters</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredOrders.map((order) => {
                                    const StatusIcon = statusConfig[order.status].icon
                                    return (
                                        <Card key={order.id} className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                                            <CardContent className="p-3 sm:p-4">
                                                <div className="space-y-3">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="font-mono font-semibold text-primary text-xs sm:text-sm">
                                                                {order.id}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(order.date).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Edit Order
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleUpdateStatus(order)}>
                                                                    <Truck className="mr-2 h-4 w-4" />
                                                                    Update Status
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <FileText className="mr-2 h-4 w-4" />
                                                                    Generate Invoice
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600" onClick={() => handleCancelOrder(order)}>
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Cancel Order
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    {/* Customer Info */}
                                                    <div className="flex items-center gap-2 sm:gap-3 py-2 border-y">
                                                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                                                            {order.customer.avatar}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-sm sm:text-base truncate">{order.customer.name}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{order.customer.email}</p>
                                                        </div>
                                                    </div>

                                                    {/* Order Details */}
                                                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                                        <div className="text-center">
                                                            <p className="text-xs text-muted-foreground mb-1">Items</p>
                                                            <Badge variant="outline" className="font-semibold text-xs">
                                                                {order.items}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-xs text-muted-foreground mb-1">Total</p>
                                                            <p className="font-bold text-sm sm:text-base">
                                                                ${order.total.toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                                                            <Badge className={cn("gap-1 text-[10px] sm:text-xs border", statusConfig[order.status].color)}>
                                                                <StatusIcon className="h-3 w-3" />
                                                                <span className="hidden sm:inline">{statusConfig[order.status].label}</span>
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <Card className="border-2 shadow-xl overflow-hidden hidden lg:block">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="font-semibold">Order ID</TableHead>
                                            <TableHead className="font-semibold">Customer</TableHead>
                                            <TableHead className="font-semibold">Items</TableHead>
                                            <TableHead className="font-semibold">Total</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold">Date</TableHead>
                                            <TableHead className="font-semibold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                                            <Package className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-lg">No orders found</p>
                                                            <p className="text-muted-foreground">Try adjusting your search or filters</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredOrders.map((order) => {
                                                const StatusIcon = statusConfig[order.status].icon
                                                return (
                                                    <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                                                        <TableCell>
                                                            <div className="font-mono font-semibold text-primary">
                                                                {order.id}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                                                                    {order.customer.avatar}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold">{order.customer.name}</p>
                                                                    <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="font-semibold">
                                                                {order.items} items
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-bold text-lg">
                                                                ${order.total.toFixed(2)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={cn("gap-2 border", statusConfig[order.status].color)}>
                                                                <span className={cn("h-2 w-2 rounded-full", statusConfig[order.status].dotColor)}></span>
                                                                <StatusIcon className="h-3.5 w-3.5" />
                                                                <span>{statusConfig[order.status].label}</span>
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(order.date).toLocaleDateString()}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-48">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        Edit Order
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order)}>
                                                                        <Truck className="mr-2 h-4 w-4" />
                                                                        Update Status
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <FileText className="mr-2 h-4 w-4" />
                                                                        Generate Invoice
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleCancelOrder(order)}>
                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                        Cancel Order
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Edit Order Sheet */}
            <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
                <SheetContent className="">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold">Edit Order</SheetTitle>
                        <SheetDescription>
                            Make changes to the order details here. Click save when you're done.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 px-6 justify-center overflow-y-auto py-6">
                        <Form {...editOrderForm}>
                            <form onSubmit={editOrderForm.handleSubmit(saveOrderEdit)} className="space-y-6">
                                {/* Order ID */}
                                <FormField
                                    control={editOrderForm.control}
                                    name="orderId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Order ID</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted cursor-not-allowed" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Customer Name */}
                                <FormField
                                    control={editOrderForm.control}
                                    name="customerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Customer Name</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input {...field} placeholder="Enter customer name" className="pl-10" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Customer Email */}
                                <FormField
                                    control={editOrderForm.control}
                                    name="customerEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Customer Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input {...field} placeholder="Enter customer email" className="pl-10" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Customer Phone */}
                                <FormField
                                    control={editOrderForm.control}
                                    name="customerPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Customer Phone</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input {...field} placeholder="Enter customer phone" className="pl-10" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Shipping Address */}
                                <FormField
                                    control={editOrderForm.control}
                                    name="shippingAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Shipping Address</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Textarea {...field} placeholder="Enter shipping address" className="pl-10 min-h-[80px] resize-none" rows={3} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Payment Method */}
                                <FormField
                                    control={editOrderForm.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input {...field} placeholder="Enter payment method" className="pl-10" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <SheetFooter className="gap-2 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditSheetOpen(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </SheetFooter>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Update Status Sheet */}
            <Sheet open={statusSheetOpen} onOpenChange={setStatusSheetOpen}>
                <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold">Update Order Status</SheetTitle>
                        <SheetDescription>
                            Change the status of the order. The customer will be notified of this change.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto py-6">
                        <div className="space-y-6">
                            {/* Order ID */}
                            <div className="space-y-2">
                                <Label htmlFor="status-order-id" className="text-sm font-medium">
                                    Order ID
                                </Label>
                                <Input
                                    id="status-order-id"
                                    type="text"
                                    value={selectedOrder?.id || ''}
                                    readOnly
                                    className="bg-muted cursor-not-allowed font-mono"
                                />
                            </div>

                            {/* Current Status */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Current Status
                                </Label>
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                                    {selectedOrder?.status && (
                                        <>
                                            <div className={cn(
                                                "h-3 w-3 rounded-full",
                                                statusConfig[selectedOrder.status]?.dotColor
                                            )} />
                                            <Badge className={cn(
                                                "gap-2 border",
                                                statusConfig[selectedOrder.status]?.color
                                            )}>
                                                {React.createElement(
                                                    statusConfig[selectedOrder.status]?.icon,
                                                    { className: "h-3.5 w-3.5" }
                                                )}
                                                <span>{statusConfig[selectedOrder.status]?.label}</span>
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* New Status */}
                            <div className="space-y-2">
                                <Label htmlFor="new-status" className="text-sm font-medium">
                                    New Status <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={newStatus}
                                    onValueChange={setNewStatus}
                                >
                                    <SelectTrigger id="new-status" className="w-full">
                                        <SelectValue placeholder="Select a new status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-yellow-500" />
                                                <span>Pending</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="processing">
                                            <div className="flex items-center gap-2">
                                                <RefreshCw className="h-4 w-4 text-blue-500" />
                                                <span>Processing</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="shipped">
                                            <div className="flex items-center gap-2">
                                                <Truck className="h-4 w-4 text-purple-500" />
                                                <span>Shipped</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="delivered">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span>Delivered</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="h-4 w-4 text-red-500" />
                                                <span>Cancelled</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Select the new status for this order
                                </p>
                            </div>

                            {/* Customer Info Card */}
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <h4 className="text-sm font-medium mb-3">Customer Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Name:</span>
                                        <span className="font-medium">{selectedOrder?.customer?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="font-medium">{selectedOrder?.customer?.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setStatusSheetOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={saveStatusUpdate}
                            className="flex-1"
                        >
                            <Truck className="mr-2 h-4 w-4" />
                            Update Status
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Cancel Order Sheet */}
            <Sheet open={cancelSheetOpen} onOpenChange={setCancelSheetOpen}>
                <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold text-destructive">Cancel Order</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. Please provide a reason for cancelling this order.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto py-6">
                        <div className="space-y-6">
                            {/* Order ID */}
                            <div className="space-y-2">
                                <Label htmlFor="cancel-order-id" className="text-sm font-medium">
                                    Order ID
                                </Label>
                                <Input
                                    id="cancel-order-id"
                                    type="text"
                                    value={selectedOrder?.id || ''}
                                    readOnly
                                    className="bg-muted cursor-not-allowed font-mono"
                                />
                            </div>

                            {/* Order Details Card */}
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <h4 className="text-sm font-medium mb-3">Order Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Customer:</span>
                                        <span className="font-medium">{selectedOrder?.customer?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Items:</span>
                                        <span className="font-medium">{selectedOrder?.items} items</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Amount:</span>
                                        <span className="font-bold text-lg">${selectedOrder?.total?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Current Status:</span>
                                        {selectedOrder?.status && (
                                            <Badge className={cn(
                                                "gap-1",
                                                statusConfig[selectedOrder.status]?.color
                                            )}>
                                                {React.createElement(
                                                    statusConfig[selectedOrder.status]?.icon,
                                                    { className: "h-3 w-3" }
                                                )}
                                                <span>{statusConfig[selectedOrder.status]?.label}</span>
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Cancellation Reason */}
                            <div className="space-y-2">
                                <Label htmlFor="cancel-reason" className="text-sm font-medium">
                                    Reason for Cancellation <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="cancel-reason"
                                    placeholder="Please provide a detailed reason for cancelling this order..."
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                    rows={5}
                                />
                                <p className="text-xs text-muted-foreground">
                                    This reason will be shared with the customer
                                </p>
                            </div>

                            {/* Warning Message */}
                            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                                <div className="flex gap-3">
                                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-destructive">
                                            Warning: This action is permanent
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Once cancelled, the order cannot be restored. The customer will receive a notification about the cancellation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setCancelSheetOpen(false)}
                            className="flex-1"
                        >
                            Go Back
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmCancelOrder}
                            className="flex-1"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Order
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}