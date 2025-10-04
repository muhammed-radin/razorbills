import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator";
import { StarIcon, ShoppingCart, Heart, Share2, Minus, Plus, LoaderPinwheel } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/models/product";
import { currency } from "@/utils/currency";
import StyledMd from "@/components/styled-md";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ReviewCard from "@/components/review-card";
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";
import axios from "axios";
import { LoaderScreen } from "@/components/LoaderScreen";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        // Fetch products from the API
        axios.get(import.meta.env.VITE_API_ENDPOINT + '/api/products')
            .then(response => {
                setProducts(response.data);
            }
            )
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    if (products.length === 0) {
        return <LoaderScreen />
    }


    // Find the product by ID (in real app, this would be fetched from API)
    const product = products.find(p => p.id == parseInt(id));
    if (!product) {
        navigate('/404')
    }


    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    product.name = product.title

    return (
        <div className="min-h-screen p-3 sm:p-6 lg:p-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted-foreground max-w-7xl mx-auto">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link to={"/search?category=" + product.category}>{product.category}</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{product.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </nav>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Images */}
                <div className="space-y-4 sm:w-full max-w-md">
                    {/* Main Image */}
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Thumbnail Images */}
                    {product.images.length > 1 && (
                        <div className="flex space-x-3">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={cn(
                                        "w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                                        selectedImage === index ? "border-primary" : "border-gray-200"
                                    )}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                    {/* Title and Brand */}
                    <div>
                        <Badge variant="secondary" className="mb-2">{product.brand}</Badge>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        className={cn(
                                            "h-4 w-4",
                                            star <= Math.round(product.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                ({product.rating}) • {product.reviewCount} reviews
                            </span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl font-bold text-foreground">
                                {currency(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                                <>
                                    <span className="text-lg text-muted-foreground line-through">
                                        {currency(product.originalPrice)}
                                    </span>
                                    <Badge variant="destructive" className="text-xs">
                                        {discount}% OFF
                                    </Badge>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Free shipping on orders over {currency(300)}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center space-x-2">
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            product.stock > 0 ? "bg-green-500" : "bg-red-500"
                        )}></div>
                        <span className="text-sm">
                            {product.stock > 0
                                ? `${product.stock} items in stock`
                                : "Out of stock"
                            }
                        </span>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium">Quantity:</label>
                            <div className="flex items-center border rounded-md">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="h-9 w-9 p-0"
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="px-4 text-center min-w-[3rem]">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stock}
                                    className="h-9 w-9 p-0"
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                size="lg"
                                className="sm:flex-1"
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                            </Button>
                            <div className="flex space-x-2 flex-row max-sm:justify-center sm:w-49">
                                <Button variant="outline" size="lg" className="w-[49%]">
                                    <Heart className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="lg" className="w-[49%]">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="max-w-7xl mx-auto mt-12 space-y-8">
                <Separator />
                {/* Detailed Description */}
                <div className="sm:max-w-3xl max-sm:max-w-full">
                    <h2 className="text-2xl font-bold mb-4">Product Details</h2>
                    {/* Using StyledMd component to render markdown */}
                    <StyledMd>{product.detailedDescription || product.description}</StyledMd>
                </div>

                <br />

                <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-stretch lg:space-x-4 space-y-6 lg:space-y-0">

                    {/* Specifications */}
                    <Card className="shrink-0 flex-1">
                        <CardHeader>
                            <CardTitle>Specifications</CardTitle>
                            <CardDescription>
                                Technical specifications and details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.specifications && product.specifications.map((spec, index) => (
                                    <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                                        <span className="font-medium text-sm">{spec.label}</span>
                                        <span className="text-sm text-muted-foreground">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Features</CardTitle>
                            <CardDescription>
                                Key features and benefits
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.features && product.features.map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Review */}
            {/* Reviews Section */}
            <div className="max-w-7xl mx-auto mt-12 space-y-8">
                <Tabs defaultValue="review">
                    <TabsList>
                        <TabsTrigger value="review">Reviews</TabsTrigger>
                        <TabsTrigger value="similar">Products From {product.brand}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="review" className="w-full">
                        <Card className="bg-background">
                            <CardHeader>
                                <CardTitle>Customer Reviews</CardTitle>
                                <CardDescription>
                                    See what our customers are saying
                                </CardDescription>
                                <Drawer>
                                    <DrawerTrigger variant="outline" size="sm" className="ml-auto my-1">
                                        <span variant="outline" size="sm" className="ml-auto my-1">
                                            Write a Review</span>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                            <DrawerDescription>This action cannot be undone.</DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter className="space-x-2 flex flex-row items-center justify-center">
                                            <Button>Submit</Button>
                                            <DrawerClose>
                                                Cancel
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                                <Separator className="my-2" />
                            </CardHeader>
                            <CardContent className='w-full'>
                                <div className="flex flex-wrap gap-4 flex-row items-stretch justify-center">
                                    {([1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9]).map((it, index) => {
                                        return (<ReviewCard review={{
                                            date: new Date(),
                                            author: "John Doe",
                                            comment: "Great product! Highly recommend it.".repeat(index),
                                            title: "Excellent Quality",
                                            rating: Math.floor(Math.random() * 5),
                                        }} className="w-[350px]" key={index} />)
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="similar"><Card className="bg-background">
                        <CardHeader>
                            <CardTitle>Products From {product.brand}</CardTitle>
                            <CardDescription>
                                Explore more products from this brand
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='w-full'>
                            <div className="flex flex-wrap gap-4 flex-row items-stretch justify-center">
                                {([1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9]).map((it, index) => {
                                    return (<HorizontalProductCard product={products[index % products.length]} className="w-[350px]" />)
                                })}
                            </div>
                        </CardContent>
                    </Card></TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ProductDetailsPage;