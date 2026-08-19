import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { limitWords } from "@/utils/string";
import React from "react";

const OrderProductCardComponent = ({ variant, className }) => {
  let varientStyle = "";
  if (variant === "borderless") {
    varientStyle = "border-0 shadow-none";
  }

  return (
    <Card
      className={cn(
        " w-full  relative flex flex-row items-start justify-start p-4 pl-0 gap-3 mb-5",
        varientStyle,
        className
      )}
    >
      <div className="mx-2">
        <img
          src="/products/Headphone.jpg"
          alt="Product Image"
          className="w-[70px] min-w-[60px] rounded-md bg-background"
        />
      </div>
      <CardContent className="m-0 p-0">
        <CardTitle>Delivered on sep 24</CardTitle>
        <CardDescription>
          {limitWords(
            "Product description goes here. It provides a brief overview of the product features.",
            10
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

OrderProductCardComponent.displayName = 'OrderProductCard';

export const OrderProductCard = React.memo(OrderProductCardComponent);

export default OrderProductCard;
