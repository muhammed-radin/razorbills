import React, { memo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

import CategoryList from "@/components/category-tag/CategoryList";
import SearchBar from "@/components/searchBar/SearchBar";
import CarouselSlide from "@/components/carousel";
import ListHorizontalProductCards from "@/components/horizontal-card/list-horizontal-product-cards";
import ContentGrid from "@/components/content-grid";
import ModernCarousel from "@/components/modern-carousel";
import { LoaderScreen } from "@/components/LoaderScreen";
import { api } from "@/utils/api";
import ClassicProcuctsSlider from "@/components/product-card/products-slider";
import HighlightedSlider from "@/components/highlighted-slider";
import FeaturedCarousel from "@/components/featured-carousel";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyProductsSection = memo(function EmptyProductsRender() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle>{t("home.noProductsTitle")}</EmptyTitle>
        <EmptyDescription>
          {t("home.noProductsDesc")}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={() => navigate("/contact")}>{t("home.contactAdmin")}</Button>
        <Button variant="outline" onClick={() => navigate("/contact")}>
          {t("home.requestProduct")}
        </Button>
      </EmptyContent>
    </Empty>
  );
});

export default function HomePage() {
  const { t } = useTranslation();
  const [latestProducts, setlatestProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isEmpty = latestProducts.length === 0 && featuredProducts.length === 0;

  React.useEffect(() => {
    // Fetch products from the API
    api.client
      .get("/api/products/feed")
      .then((response) => {
        setlatestProducts(response.data.latest || []);
        setFeaturedProducts(response.data.featured || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full">
      <Helmet>
        <title>{t("home.helmetTitle")}</title>
        <meta
          name="description"
          content={t("home.helmetDescription")}
        />
        <meta
          name="keywords"
          content="electronics, components, resistor, diode, led, transistor, battery, fuse, potentiometer, speaker, microphone, microcontroller"
        />
      </Helmet>
      {/* Highlighted Image Slider - Full Width Hero Style */}
      <HighlightedSlider className="" />

      {/* Main Content */}
      <div className="p-3 sm:p-3 w-full max-w-7xl mx-auto">
        <br />
        <SearchBar />
        <CategoryList
          className="w-[90%] sm:w-2/3 mx-auto max-sm:flex-row max-sm:flex-nowrap max-sm:justify-start max-sm:items-center max-sm:overflow-x-auto max-sm:p-0 whitespace-nowrap"
          tagClassName="max-sm:rounded-md"
        />
      </div>

      <div className="w-full">
        {loading ? (
          <LoaderScreen />
        ) : (
          <>
            {/* Featured Products Carousel - Premium Cards */}
            {featuredProducts.length > 0 && (
              <FeaturedCarousel
                title={t("home.featuredCollection")}
                products={featuredProducts}
              />
            )}

            {/* Content Grid - Categories & Offers */}
            <ContentGrid title={t("home.exploreCategories")} />

            {/* Blank Section */}
            {isEmpty && <EmptyProductsSection />}

            {/* New Arrivals - Regular Carousel Design */}
            {latestProducts.length > 0 && (
              <CarouselSlide
                title={t("home.newArrivals")}
                variant="new-arrivals"
                products={latestProducts}
              />
            )}

            {/* Product Grid */}
            {latestProducts.length > 0 && (
              <ClassicProcuctsSlider
                title={t("home.allProducts")}
                products={latestProducts.slice(0, 10)}
              />
            )}

            {/* Horizontal Product Cards */}
            {latestProducts.length > 0 && (
              <ListHorizontalProductCards products={latestProducts} />
            )}

            {/* Top Rated - Modern Carousel Design */}
            {latestProducts.length > 0 && (
              <ModernCarousel
                title={t("home.topRated")}
                variant="top-rated"
                products={latestProducts}
              />
            )}

            {/* More Horizontal Cards */}
            {latestProducts.length > 0 && (
              <ListHorizontalProductCards products={latestProducts} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
