import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

const sizeMap = {
    '1': 'w-1 h-1',
    '2': 'w-2 h-2',
    '3': 'w-3 h-3',
    '4': 'w-4 h-4',
    '5': 'w-5 h-5',
    '6': 'w-6 h-6',
};

const RatingStar = React.memo(function RatingStar({ filled, label, size = '4' }) {
    const starSizeClass = sizeMap[size] || 'w-4 h-4';

    return (
        <div className="flex items-center">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        className={cn(
                            starSizeClass,
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
});

export default RatingStar;