import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
    Users,
    Search,
    Filter,
    Download,
    Eye,
    Mail,
    Phone,
    MapPin,
    ShoppingBag,
    DollarSign,
    Calendar,
    MoreVertical,
    UserPlus,
    Edit,
    Trash2,
    Star,
    TrendingUp,
    Award,
    Heart,
    Package,
    Ban,
    CheckCircle,
    UserCheck,
    Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { api } from "@/utils/api"
import axios from "axios"
import { cn } from "@/lib/utils"

const customerTierConfig = {
    new: {
        label: "New",
        icon: UserPlus,
        color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
        dotColor: "bg-gray-500",
    },
    regular: {
        label: "Regular",
        icon: UserCheck,
        color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        dotColor: "bg-blue-500",
    },
    premium: {
        label: "Premium",
        icon: Star,
        color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
        dotColor: "bg-purple-500",
    },
    vip: {
        label: "VIP",
        icon: Crown,
        color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        dotColor: "bg-amber-500",
    },
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [tierFilter, setTierFilter] = useState("all")
    const [sortBy, setSortBy] = useState("recent")
    const [currentTab, setCurrentTab] = useState("all")

    // Mock data - Replace with actual API calls
    const mockCustomers = [
        {
            id: "CUST-001",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 234 567 8900",
            avatar: "JD",
            image: "",
            tier: "vip",
            totalOrders: 24,
            totalSpent: 12450.00,
            averageOrderValue: 518.75,
            joinDate: "2025-03-15",
            lastOrder: "2026-01-02",
            location: "New York, USA",
            status: "active",
        },
        {
            id: "CUST-002",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+1 234 567 8901",
            avatar: "JS",
            image: "",
            tier: "premium",
            totalOrders: 15,
            totalSpent: 7890.50,
            averageOrderValue: 526.03,
            joinDate: "2025-05-20",
            lastOrder: "2026-01-03",
            location: "Los Angeles, USA",
            status: "active",
        },
        {
            id: "CUST-003",
            name: "Bob Wilson",
            email: "bob.wilson@example.com",
            phone: "+1 234 567 8902",
            avatar: "BW",
            image: "",
            tier: "regular",
            totalOrders: 8,
            totalSpent: 3200.00,
            averageOrderValue: 400.00,
            joinDate: "2025-08-10",
            lastOrder: "2026-01-04",
            location: "Chicago, USA",
            status: "active",
        },
        {
            id: "CUST-004",
            name: "Alice Johnson",
            email: "alice.j@example.com",
            phone: "+1 234 567 8903",
            avatar: "AJ",
            image: "",
            tier: "regular",
            totalOrders: 5,
            totalSpent: 1890.00,
            averageOrderValue: 378.00,
            joinDate: "2025-10-05",
            lastOrder: "2026-01-04",
            location: "Houston, USA",
            status: "active",
        },
        {
            id: "CUST-005",
            name: "Charlie Brown",
            email: "charlie.b@example.com",
            phone: "+1 234 567 8904",
            avatar: "CB",
            image: "",
            tier: "new",
            totalOrders: 2,
            totalSpent: 450.00,
            averageOrderValue: 225.00,
            joinDate: "2025-12-20",
            lastOrder: "2026-01-03",
            location: "Phoenix, USA",
            status: "active",
        },
        {
            id: "CUST-006",
            name: "Diana Prince",
            email: "diana.p@example.com",
            phone: "+1 234 567 8905",
            avatar: "DP",
            image: "",
            tier: "premium",
            totalOrders: 18,
            totalSpent: 9100.00,
            averageOrderValue: 505.56,
            joinDate: "2025-04-12",
            lastOrder: "2025-12-28",
            location: "Seattle, USA",
            status: "inactive",
        },
    ]

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            setIsLoading(true)
            // Replace with actual API call
            // const response = await axios.get(api.customers())
            // setCustomers(response.data)

            // Using mock data for now
            setTimeout(() => {
                setCustomers(mockCustomers)
                setIsLoading(false)
            }, 1000)
        } catch (error) {
            console.error("Error fetching customers:", error)
            toast.error("Failed to load customers")
            setIsLoading(false)
        }
    }

    const getCustomerStats = () => {
        const stats = {
            total: customers.length,
            active: customers.filter(c => c.status === "active").length,
            inactive: customers.filter(c => c.status === "inactive").length,
            new: customers.filter(c => c.tier === "new").length,
            regular: customers.filter(c => c.tier === "regular").length,
            premium: customers.filter(c => c.tier === "premium").length,
            vip: customers.filter(c => c.tier === "vip").length,
            totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
            averageLifetimeValue: customers.length > 0
                ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length
                : 0,
        }
        return stats
    }

    const filteredCustomers = customers
        .filter(customer => {
            const matchesSearch =
                customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.id.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesTier = tierFilter === "all" || customer.tier === tierFilter
            const matchesTab =
                currentTab === "all" ||
                (currentTab === "active" && customer.status === "active") ||
                (currentTab === "inactive" && customer.status === "inactive")

            return matchesSearch && matchesTier && matchesTab
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "recent":
                    return new Date(b.lastOrder) - new Date(a.lastOrder)
                case "oldest":
                    return new Date(a.joinDate) - new Date(b.joinDate)
                case "spent-desc":
                    return b.totalSpent - a.totalSpent
                case "spent-asc":
                    return a.totalSpent - b.totalSpent
                case "orders-desc":
                    return b.totalOrders - a.totalOrders
                default:
                    return 0
            }
        })

    const stats = getCustomerStats()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg sm:text-xl font-semibold text-foreground mb-1">Loading Customers</p>
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
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 p-4 sm:p-6 md:p-8 text-white shadow-2xl">
                    <div className="absolute -top-32 -right-32 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-32 -left-32 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Customer Management</h1>
                                <p className="text-white/80 text-sm sm:text-base md:text-lg mt-1">
                                    Manage and engage with your customers
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
                            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-white/70 truncate">Total Customers</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold">{stats.total}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-white/70 truncate">Active</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold">{stats.active}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-white/70 truncate">VIP Members</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold">{stats.vip}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-white/70 truncate">Avg. LTV</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold">${stats.averageLifetimeValue.toFixed(0)}</p>
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
                                    placeholder="Search customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 sm:h-11 border-2 focus-visible:border-primary text-sm sm:text-base"
                                />
                            </div>
                            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                                <Select value={tierFilter} onValueChange={setTierFilter}>
                                    <SelectTrigger className="h-10 sm:h-11 border-2 text-xs sm:text-sm">
                                        <SelectValue placeholder="Tier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Tiers</SelectItem>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="regular">Regular</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                        <SelectItem value="vip">VIP</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="h-10 sm:h-11 border-2 text-xs sm:text-sm">
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">Most Recent</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="spent-desc">Highest Spending</SelectItem>
                                        <SelectItem value="spent-asc">Lowest Spending</SelectItem>
                                        <SelectItem value="orders-desc">Most Orders</SelectItem>
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

                {/* Customers Tabs */}
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50 gap-1">
                        <TabsTrigger value="all" className="flex flex-col items-center gap-1 py-2 sm:py-3 text-xs sm:text-sm">
                            <span className="font-semibold">All</span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2">{stats.total}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="active" className="flex flex-col items-center gap-1 py-2 sm:py-3 text-xs sm:text-sm">
                            <span className="font-semibold">Active</span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 bg-green-500/20 text-green-700">{stats.active}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="inactive" className="flex flex-col items-center gap-1 py-2 sm:py-3 text-xs sm:text-sm">
                            <span className="font-semibold">Inactive</span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 bg-gray-500/20 text-gray-700">{stats.inactive}</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={currentTab} className="mt-4 sm:mt-6">
                        <div className="grid gap-3 sm:gap-4 md:gap-6">
                            {filteredCustomers.length === 0 ? (
                                <Card className="border-2 shadow-xl">
                                    <CardContent className="py-8 sm:py-12">
                                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-muted flex items-center justify-center">
                                                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-base sm:text-lg">No customers found</p>
                                                <p className="text-xs sm:text-sm text-muted-foreground">Try adjusting your search or filters</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                                    {filteredCustomers.map((customer) => {
                                        const TierIcon = customerTierConfig[customer.tier].icon
                                        return (
                                            <Card key={customer.id} className="border-2 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group">
                                                <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b p-3 sm:p-6">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                                            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                                                                {customer.avatar}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <CardTitle className="text-base sm:text-lg truncate">{customer.name}</CardTitle>
                                                                <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">{customer.id}</p>
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Profile
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Customer
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Mail className="mr-2 h-4 w-4" />
                                                                    Send Email
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600">
                                                                    <Ban className="mr-2 h-4 w-4" />
                                                                    Deactivate
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="pt-3 sm:pt-4 space-y-3 sm:space-y-4 p-3 sm:p-6">
                                                    {/* Tier Badge */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <Badge className={cn("gap-1.5 sm:gap-2 border text-xs", customerTierConfig[customer.tier].color)}>
                                                            <span className={cn("h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full", customerTierConfig[customer.tier].dotColor)}></span>
                                                            <TierIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                            {customerTierConfig[customer.tier].label}
                                                        </Badge>
                                                        <Badge variant={customer.status === "active" ? "default" : "secondary"} className="text-xs">
                                                            {customer.status}
                                                        </Badge>
                                                    </div>

                                                    {/* Contact Info */}
                                                    <div className="space-y-1.5 sm:space-y-2">
                                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                                            <span className="text-muted-foreground truncate">{customer.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                                            <span className="text-muted-foreground">{customer.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                                            <span className="text-muted-foreground truncate">{customer.location}</span>
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t">
                                                        <div className="text-center">
                                                            <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                                                                <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                                                                <p className="text-[10px] sm:text-xs text-muted-foreground">Orders</p>
                                                            </div>
                                                            <p className="text-base sm:text-lg font-bold">{customer.totalOrders}</p>
                                                        </div>
                                                        <div className="text-center border-x">
                                                            <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                                                                <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600" />
                                                                <p className="text-[10px] sm:text-xs text-muted-foreground">Spent</p>
                                                            </div>
                                                            <p className="text-base sm:text-lg font-bold text-green-600">${customer.totalSpent.toFixed(0)}</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                                                                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600" />
                                                                <p className="text-[10px] sm:text-xs text-muted-foreground">AOV</p>
                                                            </div>
                                                            <p className="text-base sm:text-lg font-bold text-blue-600">${customer.averageOrderValue.toFixed(0)}</p>
                                                        </div>
                                                    </div>

                                                    {/* Dates */}
                                                    <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t text-[10px] sm:text-xs">
                                                        <div>
                                                            <p className="text-muted-foreground mb-0.5 sm:mb-1">Joined</p>
                                                            <div className="flex items-center gap-0.5 sm:gap-1 font-semibold">
                                                                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                                <span className="truncate">{new Date(customer.joinDate).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground mb-0.5 sm:mb-1">Last Order</p>
                                                            <div className="flex items-center gap-0.5 sm:gap-1 font-semibold">
                                                                <Package className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                                <span className="truncate">{new Date(customer.lastOrder).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2 pt-2 sm:pt-3 border-t">
                                                        <Button variant="outline" size="sm" className="flex-1 h-8 sm:h-9 text-xs">
                                                            <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                            View
                                                        </Button>
                                                        <Button size="sm" className="flex-1 h-8 sm:h-9 text-xs">
                                                            <Mail className="mr-1 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                            Contact
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
