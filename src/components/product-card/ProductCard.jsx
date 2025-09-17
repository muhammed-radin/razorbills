
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const ProductCard = ({ product }) => {
  return (
    <Card className="w-40 sm:w-45 h-55  border shadow-none border-none rounded-none p-0 bg-transparent  gap-3  ">
      <CardHeader className="h-40 border-3 rounded-2xl p-0 m-0 overflow-hidden bg-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover hover:scale-115 transition-transform duration-300 ease-in-out"
        />
      </CardHeader>

      <CardContent className="p-0 m-0">
        <h2 className="text-sm font-semibold line-clamp-1">
          {product.name}
        </h2>
        <p className="space-x-2" >
              <span className=" text-[13px] text-gray-600 line-through"> ${product.price} </span>      <span className=" text-[13px] font-bold "> ${product.price}</span>
        </p>
       
      </CardContent>
    </Card>
  );
};

export default ProductCard;