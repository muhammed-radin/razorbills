
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Preloader } from "../LoaderScreen";

const ProductCard = ({ product, index }) => {
    const navigate = useNavigate();

    const handleProductClick = () => {
        // Generate a simple ID based on the product name and index
        const productId = (index + 1).toString();
        navigate(`/product/${productId}`);
    };

    const [imageLoaded, setLoadedState] = useState(false);

    function onImageLoad() {
        setLoadedState(true);
    }

    return (
        <Card
            className="w-35 sm:w-45 h-55 border shadow-none border-none rounded-none p-0 bg-transparent gap-3 cursor-pointer transition-shadow duration-300"
            onClick={handleProductClick}
        >
            <CardHeader className="h-40 border-1 max-sm:border-2 rounded-2xl p-0 m-0 overflow-hidden bg-center">
                <img
                    src={product.image || product.thumbnail}
                    alt={product.name || product.title}
                    className={cn("w-full h-40 object-cover hover:scale-105 transition-transform duration-300 ease-in-out bg-background", { 'hidden': !imageLoaded })}
                    onLoad={onImageLoad}
                />
                <div className={cn("w-full h-40 object-cover hover:scale-105 transition-transform duration-300 ease-in-out bg-background flex items-center justify-center", { 'hidden': imageLoaded })}><Preloader></Preloader></div>
            </CardHeader>

            <CardContent className="p-0 m-0">
                <h2 className="text-sm font-semibold line-clamp-1">
                    {product.name || product.title}
                </h2>
                <p className="space-x-2" >
                    <span className=" text-[13px] text-red-950 dark:text-red-300 line-through"> ${product.price} </span>      <span className=" text-[13px] font-bold text-green-600 dark:text-green-400"> ${product.price}</span>
                </p>

            </CardContent>
        </Card>
    );
};

export default ProductCard;