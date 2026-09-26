import { useState } from "react";
import { Send } from "lucide-react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { commentsApi, interactionsApi } from "@/services/shop";

export function ReviewRatingReviewForm({ storeData, productId, onSubmitted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [formData, setFormData] = useState({
    review: "",
    rating: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (productId) {
        await commentsApi.create(productId, formData.review, rating);
        if (rating > 0) {
          await interactionsApi.rate(productId, rating).catch(() => {});
        }
        toast.success("Review submitted!");
        onSubmitted?.();
      } else {
        // No product context — showcase mode
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setRating(0);
      setFormData({ name: "", email: "", review: "" });
    } catch {
      toast.error("Please log in to submit a review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:sticky lg:top-8 lg:h-fit">
      <Card>
        <CardHeader>
          <CardTitle id="review-form-heading">{storeData.formTitle}</CardTitle>
          <CardDescription>{storeData.formDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    variant="ghost"
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="h-9 px-4 py-2 focus-visible:ring-ring cursor-pointer rounded-full !p-1 hover:bg-transparent focus:outline-hidden focus-visible:ring-2"
                    aria-pressed={rating === star}
                    aria-label={`Rate ${star} ${star === 1 ? "star" : "stars"}`}
                  >
                    <Star
                      className={cn(
                        "size-6",
                        (hoveredStar || rating) >= star
                          ? "fill-foreground"
                          : "",
                      )}
                    />
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="review">{storeData.reviewLabel}</Label>
              <Textarea
                id="review"
                value={formData.review}
                onChange={(e) =>
                  setFormData({ ...formData, review: e.target.value })
                }
                placeholder={storeData.reviewPlaceholder}
                required
                aria-required="true"
              />
            </div>

            <Button
              type="submit"
              className="h-9 px-4 py-2 w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? storeData.submittingButtonText
                : storeData.submitButtonText}
              {!isSubmitting && <Send className="size-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReviewRatingReviewForm;
