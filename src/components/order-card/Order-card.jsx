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

export function OrderProductCard({ variant, className }) {
  let varientStyle = "";
  if (variant === "borderless") {
    varientStyle = "border-0 shadow-none";
  }

  return (
    <Card
      className={cn(
        "w-[400px] min-w-[300px] max-sm:max-w-[300px] relative flex flex-row items-start justify-start p-4 pl-0 gap-3",
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
}

export default OrderProductCard;
