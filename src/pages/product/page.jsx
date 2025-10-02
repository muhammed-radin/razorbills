import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { StarIcon, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
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

// Sample product data - in a real app this would come from an API or context
import { products } from "./sample-data";
import ReviewCard from "@/components/review-card";
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Find the product by ID (in real app, this would be fetched from API)
    const product = products.find(p => p.id === id) || products[0];

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            {/* Breadcrumb */}
            <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground max-w-7xl mx-auto">
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

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Product Images */}
                <div className="space-y-3 sm:space-y-4 w-full lg:max-w-md mx-auto">
                    {/* Main Image */}
                    <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-50 border">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Thumbnail Images */}
                    {product.images.length > 1 && (
                        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={cn(
                                        "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 transition-colors",
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
                <div className="space-y-4 sm:space-y-6">
                    {/* Title and Brand */}
                    <div>
                        <Badge variant="secondary" className="mb-2 text-xs sm:text-sm">{product.brand}</Badge>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        className={cn(
                                            "h-3 w-3 sm:h-4 sm:w-4",
                                            star <= Math.round(product.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                                ({product.rating}) • {product.reviewCount} reviews
                            </span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <span className="text-2xl sm:text-3xl font-bold text-foreground">
                                {currency(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                                <>
                                    <span className="text-base sm:text-lg text-muted-foreground line-through">
                                        {currency(product.originalPrice)}
                                    </span>
                                    <Badge variant="destructive" className="text-xs">
                                        {discount}% OFF
                                    </Badge>
                                </>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Free shipping on orders over {currency(300)}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            product.stock > 0 ? "bg-green-500" : "bg-red-500"
                        )}></div>
                        <span className="text-xs sm:text-sm">
                            {product.stock > 0
                                ? `${product.stock} items in stock`
                                : "Out of stock"
                            }
                        </span>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <label className="text-xs sm:text-sm font-medium">Quantity:</label>
                            <div className="flex items-center border rounded-md">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="px-3 sm:px-4 text-center min-w-[2.5rem] sm:min-w-[3rem] text-sm sm:text-base">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stock}
                                    className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Button
                                size="lg"
                                className="flex-1 text-sm sm:text-base"
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                            </Button>
                            <div className="flex gap-2 justify-center">
                                <Button variant="outline" size="lg" className="flex-1 sm:flex-none sm:w-auto">
                                    <Heart className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="lg" className="flex-1 sm:flex-none sm:w-auto">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <h3 className="text-xs sm:text-sm font-medium">Tags:</h3>
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
            <div className="max-w-7xl mx-auto mt-8 sm:mt-12 space-y-6 sm:space-y-8">
                <Separator />
                {/* Detailed Description */}
                <div className="w-full max-w-3xl">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Product Details</h2>
                    {/* Using StyledMd component to render markdown */}
                    <StyledMd>{product.detailedDescription}</StyledMd>
                </div>

                <br />

                <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-stretch gap-4 lg:gap-4">
                    {/* Specifications */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle className="text-base sm:text-lg">Specifications</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Technical specifications and details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                {product.specifications.map((spec, index) => (
                                    <div key={index} className="flex justify-between py-2 border-b last:border-b-0 gap-2">
                                        <span className="font-medium text-xs sm:text-sm">{spec.label}</span>
                                        <span className="text-xs sm:text-sm text-muted-foreground text-right">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle className="text-base sm:text-lg">Features</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Key features and benefits
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 gap-2 sm:gap-3">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                        <span className="text-xs sm:text-sm">{feature}</span>
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Reviews</CardTitle>
                                <CardDescription>
                                    See what our customers are saying
                                </CardDescription>
                                <Drawer>
                                    <DrawerTrigger variant="outline" size="sm" className="ml-auto my-1">
                                       <Button variant="outline" size="sm" className="ml-auto my-1">
                                       Write a Review</Button>
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
                    <TabsContent value="similar"><Card>
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