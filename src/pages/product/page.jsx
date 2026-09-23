import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  StarIcon,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currency } from "@/utils/currency";
import StyledMd from "@/components/styled-md";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";
import { LoaderScreen } from "@/components/LoaderScreen";
import { api } from "@/utils/api";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCartStore, useWishlistStore } from "@/stores/shop";
import { interactionsApi, productsApi } from "@/services/shop";

import { ReviewRating1 } from "@/components/review/review-rating-1";

const ProductDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({ loading: true });
  const [similar, setSimilar] = useState([]);
  const [rating, setRating] = useState(0);
  // Current user's interaction for this product (GET /api/interactions/p/:productId).
  // Null = unknown (logged out / request failed) -> fall back to local stores.
  const [interaction, setInteraction] = useState(null);
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.add);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlistHas = useWishlistStore((s) => s.has);

  const hasWishlisted = interaction
    ? Boolean(interaction.hasWishlisted)
    : product?.id
      ? wishlistHas(product.id)
      : false;
  const hasShared = Boolean(interaction?.hasShared);

  useEffect(() => {
    // Fetch products from the API
    api.client
      .get(api.products(id))
      .then((response) => {
        setProduct(response.data.products || response.data || null);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          navigate("/404");
        }
        console.error("Error fetching products:", error);
      });
  }, [id, navigate]);

  const loadInteraction = useCallback(
    async (productId) => {
      if (!productId) return;
      try {
        const data = await interactionsApi.mine(productId);
        const doc = data?.interaction ?? data ?? {};
        setInteraction({
          hasViewed: Boolean(doc.hasViewed),
          hasShared: Boolean(doc.hasShared),
          hasWishlisted: Boolean(doc.hasWishlisted),
          rating: doc.rating ?? 0,
        });
        if (typeof doc.rating === "number" && doc.rating > 0) {
          setRating(doc.rating);
        }
      } catch (error) {
        // 404 = never interacted -> clean defaults; 401/403 = logged out -> null
        if (error?.response?.status === 404) {
          setInteraction({
            hasViewed: false,
            hasShared: false,
            hasWishlisted: false,
            rating: 0,
          });
        } else {
          setInteraction(null);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!id) return;
    // Record a product view (guest sessions allowed), then load this
    // user's interaction so wishlist/rating/share reflect the server.
    interactionsApi
      .visit(id)
      .catch(() => {})
      .finally(() => loadInteraction(id));
    // Load similar products
    productsApi
      .similar(id, { limit: 8 })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.products ?? []);
        setSimilar(list);
      })
      .catch(() => {});
  }, [id, loadInteraction]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      toast.success(
        t("product.addedToCart", { defaultValue: "Added to cart" }),
      );
    } catch {
      toast.error(t("common.error", { defaultValue: "Failed to add to cart" }));
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(product);
      // Optimistic update — the server flag lags behind the event buffer flush
      setInteraction((prev) =>
        prev ? { ...prev, hasWishlisted: !prev.hasWishlisted } : prev,
      );
      toast.success(
        hasWishlisted
          ? t("product.removedFromWishlist", {
              defaultValue: "Removed from wishlist",
            })
          : t("product.addedToWishlist", { defaultValue: "Saved to wishlist" }),
      );
    } catch {
      toast.error(
        t("common.error", { defaultValue: "Failed to update wishlist" }),
      );
    }
  };

  const handleShare = async () => {
    try {
      await interactionsApi.share(id);
      setInteraction((prev) => (prev ? { ...prev, hasShared: true } : prev));
    } catch {
      // sharing is still useful offline — ignore API errors
    }
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url).catch(() => {});
      toast.success(
        t("common.linkCopied", { defaultValue: "Product link copied!" }),
      );
    }
  };

  const handleRate = async (stars) => {
    setRating(stars);
    try {
      await interactionsApi.rate(id, stars);
      setInteraction((prev) => (prev ? { ...prev, rating: stars } : prev));
      toast.success(
        t("product.ratingSaved", { defaultValue: "Thanks for rating!" }),
      );
    } catch {
      toast.error(
        t("product.loginToRate", {
          defaultValue: "Please log in to rate this product",
        }),
      );
    }
  };

  const discount = useMemo(() => {
    if (!product || !product.originalPrice || !product.price) return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );
  }, [product]);

  const handleQuantityChange = useCallback(
    (change) => {
      setQuantity((prevQuantity) => {
        const newQuantity = prevQuantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
          return newQuantity;
        }
        return prevQuantity;
      });
    },
    [product.stock],
  );

  if (product.loading) {
    return <LoaderScreen />;
  }

  if (!product || !product.id) {
    return null;
  }

  return (
    <div className="min-h-screen max-w-7xl flex flex-col p-4 lg:p-8 mx-auto">
      <Helmet>
        <title>{`${product.title} - RazorBills`}</title>
        <meta name="description" content={product.description} />
        <meta
          name="keywords"
          content={`${product.title}, ${product.category}, ${product.brand}, ${(product.tags || []).join(", ")}`}
        />
      </Helmet>
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground max-w-7xl justify-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/">{t("product.home")}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to={"/search?category=" + product.category}>
                {product.category}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <div className="max-w-7xl justify-items-center lg:justify-items-normal grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
        {/* Product Images */}
        <div className="space-y-4 w-full max-w-lg">
          {/* Main Image */}
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border">
            <img
              src={
                (product.images && product.images[selectedImage]) ||
                product.thumbnail
              }
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0",
                    selectedImage === index
                      ? "border-primary"
                      : "border-gray-200",
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Title and Brand */}
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.brand}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= Math.round(product.rating || 5)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating}) • {product.reviewCount || 0} reviews
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-foreground">
                {currency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {currency(product.originalPrice)}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    {discount}% {t("common.off")}
                  </Badge>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("product.freeShippingThreshold", { amount: currency(500) })}
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                product.stock > 0 ? "bg-green-500" : "bg-red-500",
              )}
            ></div>
            <span className="text-sm">
              {product.stock > 0
                ? t("product.stockCount", { count: product.stock })
                : t("product.outOfStock")}
            </span>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">
                {t("product.quantity")}
              </label>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-9 w-9 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-4 text-center min-w-[3rem]">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="h-9 w-9 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="sm:flex-1"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t("product.addToCart")}
              </Button>
              <div className="flex space-x-2 flex-row max-sm:justify-center sm:w-49">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-[49%]"
                  aria-label={t("product.addToFavorites")}
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={cn(
                      "w-4 h-4",
                      hasWishlisted && "fill-red-500 text-red-500",
                    )}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-[49%]"
                  aria-label="Share"
                  onClick={handleShare}
                >
                  <Share2
                    className={cn(
                      "w-4 h-4",
                      hasShared && "fill-primary text-primary",
                    )}
                  />
                </Button>
              </div>
            </div>

            {/* Rate this product */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {t("product.rateThis", { defaultValue: "Rate this product" })}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRate(star)}
                    aria-label={`Rate ${star} stars`}
                    className="p-0.5"
                  >
                    <StarIcon
                      className={cn(
                        "h-5 w-5",
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("product.tags")}</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="max-w-7xl mt-12 space-y-8">
        <Separator />
        {/* Detailed Description */}
        <div className="sm:max-w-3xl max-sm:max-w-full">
          <h2 className="text-2xl font-bold mb-4">
            {t("product.productDetails")}
          </h2>
          <StyledMd>
            {product.detailedDescription || product.description}
          </StyledMd>
        </div>

        <section className="flex flex-col xl:flex-row w-full gap-4">
          {/* Specifications */}
          <Card className="w-full xl:w-1/2">
            <CardHeader>
              <CardTitle>{t("product.specifications")}</CardTitle>
              <CardDescription>{t("product.techSpecs")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 xl:grid-cols-1 gap-x-6 gap-y-1">
                {product.specifications &&
                  product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 py-2 border-b last:border-b-0"
                    >
                      <span className="font-medium text-sm shrink-0">
                        {spec.label}
                      </span>
                      <span className="text-sm text-muted-foreground sm:text-right break-words">
                        {spec.value}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="w-full xl:w-1/2">
            <CardHeader>
              <CardTitle>{t("product.features")}</CardTitle>
              <CardDescription>{t("product.keyFeatures")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-3">
                {product.features &&
                  product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Reviews Section */}
        <div className="max-w-7xl mt-12 space-y-8">
          <Tabs defaultValue="review">
            <TabsList>
              <TabsTrigger value="review">
                {t("product.reviewsTab")}
              </TabsTrigger>
              <TabsTrigger value="similar">
                {t("product.brandProductsTab", { brand: product.brand || "" })}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="review" className="w-full">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle>{t("product.customerReviews")}</CardTitle>
                  <CardDescription>
                    {t("product.reviewsSubtitle")}
                  </CardDescription>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto my-1"
                      >
                        {t("product.writeReview")}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>
                          {t("product.reviewDrawerTitle")}
                        </DrawerTitle>
                        <DrawerDescription>
                          {t("product.reviewDrawerDesc")}
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter className="space-x-2 flex flex-row items-center justify-center">
                        <Button>{t("product.submitReview")}</Button>
                        <DrawerClose asChild>
                          <Button variant="outline">
                            {t("common.cancel")}
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                  <Separator className="my-2" />
                </CardHeader>
                <CardContent className="w-full">
                  <ReviewRating1 productId={id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="similar">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle>
                    {t("product.brandProductsTab", {
                      brand: product.brand || "",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-full">
                  <div className="flex flex-wrap gap-4 flex-row items-stretch justify-center">
                    {similar.length > 0 &&
                      similar.map((item, index) => (
                        <HorizontalProductCard
                          key={item.id ?? item.productId ?? index}
                          product={item}
                          index={index}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
