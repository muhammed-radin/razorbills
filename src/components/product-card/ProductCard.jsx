
import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

const ProductCard = ({ product }) => {
    return (
        <Card className="w-32 sm:w-45 h-55  border shadow-none border-none rounded-none p-0 bg-transparent  gap-3  ">
            <CardHeader className="h-40 border-1 max-sm:border-2 rounded-2xl p-0 m-0 overflow-hidden bg-center">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
                />
            </CardHeader>

            <CardContent className="p-0 m-0">
                <h2 className="text-sm font-semibold line-clamp-1">
                    {product.name}
                </h2>
                <p className="space-x-2" >
                    <span className=" text-[13px] text-red-950 line-through"> ${product.price} </span>      <span className=" text-[13px] font-bold text-green-600"> ${product.price}</span>
                </p>

            </CardContent>
        </Card>
    );
};

export default ProductCard;