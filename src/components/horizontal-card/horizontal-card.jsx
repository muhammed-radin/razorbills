import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { limitWords } from "@/utils/string"
import { Heart, ShoppingCart } from "lucide-react"

export function HorizontalProductCard({ variant, className }) {
    let varientStyle = '';
    if (variant === 'borderless') {
        varientStyle = 'border-0 shadow-none';
    }

    return (
        <Card className={cn("w-[400px] min-w-[300px] max-sm:max-w-[300px] relative flex flex-row items-start justify-start p-4 pl-0", varientStyle, className)}>
            <div className="mx-2">
                <img src="/products/Headphone.jpg" alt="Product Image" className="w-[70px] min-w-[60px]" />
            </div>
            <CardContent className="m-0 p-0">
                <CardTitle>Product Name</CardTitle>
                <CardDescription>{limitWords("Product description goes here. It provides a brief overview of the product features.", 10)}</CardDescription>
                <div className="my-2 mb-4 text-md nax-sm:text-sm font-semibold">$99.99</div>
                <div className="flex-row gap-3 flex items-center justify-end">
                    <Button variant="outline" className="w-max">
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button type="submit" className="w-max">
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}


export default HorizontalProductCard;