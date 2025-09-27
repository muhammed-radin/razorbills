import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { currency, RupeeFormatter } from "@/utils/currency"
import { StarIcon } from "lucide-react"
export default function CardProduct({ className, title, description, price, rating, thumbnail}) {
    return (
        <div className={cn("w-full p-6 flex justify-center", className)}>
            <Card className="w-48 min-w-48">
                <CardContent className="p-3 py-0">
                    <img src={thumbnail} alt="" className="aspect-square rounded-md bg-background mb-2" />
                    <CardTitle className="text-sm mb-1">{title}</CardTitle>
                    <CardDescription className="text-xs mb-2 line-clamp-2">
                        {description}
                    </CardDescription>
                    <div className="flex items-center space-x-1 mb-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star, starIndex) => (
                                <StarIcon
                                    key={star}
                                    className={"h-3 w-3 " + (rating <= starIndex ? "text-gray-300" : "fill-yellow-400 text-yellow-400")}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">({rating.toFixed(1)})</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{currency(price)}</span>
                        <Button size="sm" className="text-xs px-2 py-1 h-7">Add</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}