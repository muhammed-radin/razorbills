import { GridCard } from "@/components/content-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { Heart, icons } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CategoriesPage() {
  const { t } = useTranslation();
  const [displayItems, setDisplayItems] = useState([
    {
      id: 1,
      title: "Wishlist",
      subtitle: "Save your favorites",
      image: null,
      icon: Heart,
      theme: "amber",
      size: "small",
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    if (id) {
      navigate(`/search?category=${id}`);
    }
  };

  useEffect(() => {
    api.client
      .get(api.categories())
      .then((response) => {
        const parsedData = response.data.map((item) => {
          const pascalCaseName = item.icon
            ? item.icon
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join("")
            : "Folder";
          const IconComponent = icons[pascalCaseName];

          return {
            id: item.id,
            title: item.name,
            subtitle: item.description || t("categories.noDescription", "No description available"),
            image: item.image || null,
            icon: IconComponent ? <IconComponent /> : null,
            theme: "amber",
            size: "small",
          };
        });
        setDisplayItems(parsedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
        setDisplayItems([]);
      });
  }, [t]);

  return (
    <div className="min-h-screen p-3 sm:p-7 max-sm:p-4 max-sm:mt-3">
      <Helmet>
        <title>{t("categories.title")} - RazorBills</title>
        <meta
          name="description"
          content={t("categories.subtitle")}
        />
        <meta
          name="keywords"
          content="categories, razorbills, products, shopping, electronics, home, fashion"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {t("categories.title")}
          </h1>
          <p className="text-gray-600">
            {t("categories.subtitle")}
          </p>
        </header>

        {/* Category List */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-auto">
          {isLoading ? (
            <>
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </>
          ) : displayItems.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              {t("categories.noCategories")}
            </p>
          ) : (
            displayItems.map((item, index) => (
              <GridCard
                key={item.id}
                item={item}
                index={index}
                onClick={() => {
                  handleCardClick(item.id);
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(CategoriesPage);
