import React from "react";
import HorizontalProductCard from "@/components/horizontal-card/horizontal-card";
import { useTranslation } from "react-i18next";

export default function Wishlist() {
  const { t } = useTranslation();
  return (
    <div className="max-w-8xl flex flex-col items-center p-4 lg:p-8">
      <div className="sm:ml-13 my-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("wishlist.title")}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
        <HorizontalProductCard />
        <HorizontalProductCard />
        <HorizontalProductCard />
        <HorizontalProductCard />
        <HorizontalProductCard />
        <HorizontalProductCard />
      </div>
    </div>
  );
}
