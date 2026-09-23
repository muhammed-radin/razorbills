import { useCallback, useEffect, useMemo, useState } from 'react'
import { Star, ThumbsUp, MessageCircle, MessageSquare, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ReviewRating1ReactionToggle } from './review-rating-1-reaction-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { storeData } from "@/pages/product/review-rating-1-data";
import { ReviewRating1ReviewForm } from './review-rating-1-review-form'
import { commentsApi } from '@/services/shop'

const toReview = (comment, index) => ({
  id: comment._id ?? comment.id ?? `comment-${index}`,
  userName: comment.userName ?? 'Anonymous',
  userAvatar: comment.userAvatar ?? '',
  rating: comment.rating ?? 5,
  date: comment.createdAt
    ? new Date(comment.createdAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0],
  content: comment.content ?? '',
  likes: 0,
  comments: 0,
});

export function ReviewRating1({ productId }) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1)
  // null = loading, [] = no comments (or 404 / error), otherwise server comments
  const [remoteReviews, setRemoteReviews] = useState(null)

  const loadComments = useCallback(() => {
    if (!productId) {
      setRemoteReviews([]);
      return;
    }
    commentsApi
      .list(productId, { limit: 20 })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.comments ?? []);
        setRemoteReviews(list.map(toReview));
        setCurrentPage(1);
      })
      .catch(() => {
        // 404 / logged out / offline -> show the empty state, not mock data
        setRemoteReviews([]);
      });
  }, [productId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const reviews = useMemo(() => remoteReviews ?? [], [remoteReviews])
  const isLoading = remoteReviews === null
  const [isLiked, setIsLiked] = useState({})
  const reviewsPerPage = 2 // Show only 2 reviews per page

  // Calculate pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)
  const currentReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * reviewsPerPage
    const endIndex = startIndex + reviewsPerPage
    return reviews.slice(startIndex, endIndex)
  }, [currentPage, reviewsPerPage, reviews])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">{storeData.pageTitle}</h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-2xl">{storeData.pageDescription}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {isLoading ? (
            <Card className="transition-all">
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t("common.loading", { defaultValue: "Loading reviews…" })}
                </p>
              </CardContent>
            </Card>
          ) : currentReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                {t("product.noCommentsTitle")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("product.noCommentsDesc")}
              </p>
            </div>
          ) : (
          currentReviews.map(review => (
            <Card key={review.id} className="transition-all hover:shadow-md">
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="bg-muted size-12">
                      <AvatarImage src={review.userAvatar} alt={`${review.userName}'s avatar`} />
                      <AvatarFallback>{review.userName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{review.userName}</h3>
                      <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                        <div className="flex" aria-label={`Rated ${review.rating} out of 5`}>
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'size-4',
                                  i < review.rating
                                    ? 'fill-foreground text-foreground'
                                    : 'text-foreground fill-transparent'
                                )}
                              />
                            ))}
                        </div>
                        <span>•</span>
                        <time
                          dateTime={new Date(review.date).toISOString().split('T')[0]}
                          className="flex items-center"
                        >
                          <Calendar className="me-1 size-3" />
                          {review.date}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mt-4 pt-[5px]">{review.content}</p>
                <div className="mt-4 flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(prev => ({ ...prev, [review.id]: !prev[review.id] }))}
                    className="h-8 px-3 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
                    aria-label={`${isLiked[review.id] ? 'Unlike' : 'Like'} this review`}
                  >
                    <ReviewRating1ReactionToggle active={!!isLiked[review.id]} icon={ThumbsUp} iconClassName='size-4' activeColorClassName='text-primary' />
                    <span>{(review.likes ?? 0) + (isLiked[review.id] ? 1 : 0)}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
                    aria-label="View comments"
                  >
                    <MessageCircle className="size-4" />
                    <span>{review.comments}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
          )}
          {totalPages > 1 ? (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>

        <ReviewRating1ReviewForm
          storeData={storeData}
          productId={productId}
          onSubmitted={loadComments}
        />
      </div>
    </div>
  )
}

export default ReviewRating1
