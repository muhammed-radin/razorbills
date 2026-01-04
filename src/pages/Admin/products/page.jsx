import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Package,
    AlertCircle,
    TrendingUp,
    Filter,
    Grid3X3,
    List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/utils/api"
import axios from "axios"
import { currency as formatCurrency } from "@/utils/currency"

export default function AdminProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredProducts, setFilteredProducts] = useState([])
    const [viewMode, setViewMode] = useState("grid") // grid or list

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredProducts(products)
        } else {
            const filtered = products.filter(
                (product) =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredProducts(filtered)
        }
    }, [searchQuery, products])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(api.products())

            setProducts(response.data || [])
            setFilteredProducts(response.data || [])
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (productId) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(api.products(productId))
                fetchProducts()
            } catch (error) {
                console.error("Error deleting product:", error)
            }
        }
    }

    const getStockStatus = (stock) => {
        if (stock === 0) {
            return { label: "Out of Stock", variant: "destructive", color: "bg-destructive" }
        } else if (stock < 10) {
            return { label: "Low Stock", variant: "secondary", color: "bg-accent" }
        } else {
            return { label: "In Stock", variant: "default", color: "bg-primary" }
        }
    }

    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length
    const outOfStockCount = products.filter((p) => p.stock === 0).length
    const inStockCount = products.filter((p) => p.stock >= 10).length

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-6 space-y-8">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground shadow-2xl">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Products</h1>
                            <p className="text-primary-foreground/80 text-lg">
                                Manage your product inventory and listings
                            </p>
                        </div>
                        <Button
                            asChild
                            size="lg"
                            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                        >
                            <Link to="/admin/products/new">
                                <Plus className="mr-2 h-5 w-5" />
                                Add Product
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">
                                {products.length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Total inventory items</p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">In Stock</CardTitle>
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{inStockCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Products available</p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
                            <div className="h-10 w-10 rounded-full bg-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <AlertCircle className="h-5 w-5 text-accent-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-accent-foreground">{lowStockCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Need restocking</p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
                            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-destructive">{outOfStockCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter Bar */}
                <Card className="shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 h-11 focus-visible:ring-2 focus-visible:ring-primary"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-11 w-11">
                                    <Filter className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center rounded-lg border bg-muted p-1">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Display */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                            <p className="text-muted-foreground font-medium">Loading products...</p>
                        </div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                                <Package className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No products found</h3>
                            <p className="text-muted-foreground max-w-sm">
                                {searchQuery
                                    ? "Try adjusting your search query to find what you're looking for"
                                    : "Get started by adding your first product to the inventory"}
                            </p>
                            {!searchQuery && (
                                <Button asChild className="mt-6">
                                    <Link to="/admin/products/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Product
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : viewMode === "grid" ? (
                    /* Grid View */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => {
                            const stockStatus = getStockStatus(product.stock)
                            return (
                                <Card
                                    key={product.id}
                                    className="group overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-muted">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {/* Discount Badge */}
                                        {product.originalPrice > product.price && (
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-destructive text-destructive-foreground border-0 shadow-lg">
                                                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                                </Badge>
                                            </div>
                                        )}
                                        {/* Stock Status Indicator */}
                                        <div className="absolute top-3 right-3">
                                            <div className={`h-3 w-3 rounded-full ${stockStatus.color} ring-2 ring-background shadow-lg`}></div>
                                        </div>
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="secondary" className="shadow-lg" asChild>
                                                    <Link to={`/product/${product.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button size="sm" variant="secondary" className="shadow-lg" asChild>
                                                    <Link to={`/admin/products/${product.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="shadow-lg"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {product.category}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                {product.sku}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                {product.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                                        </div>
                                        <div className="flex items-end justify-between pt-2 border-t">
                                            <div>
                                                <div className="text-xl font-bold text-primary">
                                                    {formatCurrency(product.price)}
                                                </div>
                                                {product.originalPrice > product.price && (
                                                    <div className="text-sm text-muted-foreground line-through">
                                                        {formatCurrency(product.originalPrice)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`h-2 w-2 rounded-full ${stockStatus.color}`}></div>
                                                    <span className="text-sm font-medium">{product.stock}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{stockStatus.label}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    /* List View */
                    <Card className="overflow-hidden">
                        <div className="divide-y">
                            {filteredProducts.map((product) => {
                                const stockStatus = getStockStatus(product.stock)
                                return (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-6 p-4 hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                                    {product.title}
                                                </h3>
                                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                                    {product.category}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>{product.brand}</span>
                                                <span className="font-mono">{product.sku}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-lg font-bold text-primary">
                                                {formatCurrency(product.price)}
                                            </div>
                                            {product.originalPrice > product.price && (
                                                <div className="text-sm text-muted-foreground line-through">
                                                    {formatCurrency(product.originalPrice)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <div className={`h-2.5 w-2.5 rounded-full ${stockStatus.color}`}></div>
                                            <div className="text-right">
                                                <div className="font-medium">{product.stock}</div>
                                                <div className="text-xs text-muted-foreground">{stockStatus.label}</div>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="flex-shrink-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/product/${product.id}`} className="flex items-center">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Product
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/products/${product.id}/edit`} className="flex items-center">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Product
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Product
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
