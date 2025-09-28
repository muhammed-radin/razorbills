import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarIcon, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample product data - in a real app this would come from an API or context
const products = [
  {
    id: "1",
    name: "Wireless Headphones",
    category: "Electronics",
    description: "High-quality sound and comfortable fit for all-day use. These wireless headphones deliver exceptional audio quality with active noise cancellation technology.",
    price: 99.99,
    originalPrice: 129.99,
    image: "/products/Headphone.jpg",
    images: ["/products/Headphone.jpg", "/products/Headphone2.jpg"],
    brand: "AudioTech",
    stock: 15,
    rating: 4.5,
    reviewCount: 256,
    tags: ["Electronics", "Audio", "Wireless", "Noise Cancellation"],
    specifications: [
      { label: "Connectivity", value: "Bluetooth 5.0, USB-C" },
      { label: "Battery Life", value: "30 hours playback" },
      { label: "Weight", value: "250g" },
      { label: "Driver Size", value: "40mm" },
      { label: "Frequency Response", value: "20Hz - 20kHz" },
      { label: "Impedance", value: "32 Ohms" }
    ],
    features: [
      "Active Noise Cancellation",
      "Quick Charge - 5 min charge for 2 hours playback",
      "Comfortable over-ear design",
      "Built-in microphone for calls",
      "Foldable design for portability"
    ]
  },
  {
    id: "2",
    name: "Bluetooth Speaker",
    category: "Speaker",
    description: "Portable speaker with deep bass and long battery life. Perfect for outdoor activities and home entertainment.",
    price: 49.99,
    originalPrice: 69.99,
    image: "/products/Speaker.webp",
    images: ["/products/Speaker.webp"],
    brand: "SoundWave",
    stock: 8,
    rating: 4.2,
    reviewCount: 189,
    tags: ["Speaker", "Bluetooth", "Portable", "Waterproof"],
    specifications: [
      { label: "Power Output", value: "20W RMS" },
      { label: "Battery Life", value: "12 hours" },
      { label: "Bluetooth Range", value: "10 meters" },
      { label: "Water Rating", value: "IPX7" },
      { label: "Charging Time", value: "3 hours" }
    ],
    features: [
      "360-degree sound",
      "IPX7 waterproof rating",
      "Built-in power bank function",
      "Voice assistant support",
      "RGB LED lighting"
    ]
  }
];

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
        <div className="min-h-screen p-3 sm:p-6 lg:p-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer">Home</span>
                <span className="mx-2">/</span>
                <span className="hover:text-foreground cursor-pointer">{product.category}</span>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">{product.name}</span>
            </nav>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Images */}
                <div className="space-y-4">
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
                                ${product.price}
                            </span>
                            {product.originalPrice > product.price && (
                                <>
                                    <span className="text-lg text-muted-foreground line-through">
                                        ${product.originalPrice}
                                    </span>
                                    <Badge variant="destructive" className="text-xs">
                                        {discount}% OFF
                                    </Badge>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Free shipping on orders over $75
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
                                className="flex-1"
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                            </Button>
                            <Button variant="outline" size="lg">
                                <Heart className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="lg">
                                <Share2 className="w-4 h-4" />
                            </Button>
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
                
                {/* Specifications */}
                <Card>
                    <CardHeader>
                        <CardTitle>Specifications</CardTitle>
                        <CardDescription>
                            Technical specifications and details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {product.specifications.map((spec, index) => (
                                <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                                    <span className="font-medium text-sm">{spec.label}</span>
                                    <span className="text-sm text-muted-foreground">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                
                {/* Features */}
                <Card>
                    <CardHeader>
                        <CardTitle>Features</CardTitle>
                        <CardDescription>
                            Key features and benefits
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {product.features.map((feature, index) => (
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
    );
};

export default ProductDetailsPage;