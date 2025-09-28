import { cn } from "@/lib/utils";
import RatingStar from "./rating-star";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function ReviewCard({ review, className }) {
  return (
    <Card className={cn("mb-4", className)}>
      <CardHeader className="flex flex-row ">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex flex-col">
          <h3>{review.author}</h3>
          <RatingStar filled={review.rating} size={3} label={true} />
        </div>
        <span className="ml-auto text-sm text-muted-foreground">
          {review.date.toLocaleDateString()}
        </span>
      </CardHeader>
      <CardContent>
        <CardTitle className='mb-2'>{review.title}</CardTitle>
        <CardDescription>{review.comment}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default ReviewCard;