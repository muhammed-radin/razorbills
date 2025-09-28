import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function RatingStar({ filled, label, size }) {
    size = size || '4'; // Default size if not provided

    return (
        <div className="flex items-center">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        className={cn(
                            ('w-'+ size +' h-'+ size),
                            star <= Math.round(filled)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        )}
                    />
                ))}
            </div>
            {label && <span className="text-sm text-muted-foreground">
                - {filled}
            </span>}
        </div>
    )
}

export default RatingStar;