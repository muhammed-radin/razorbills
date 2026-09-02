import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { OrderSummary1 } from "@/components/order-summary1";
import { toast } from "sonner";

export default function OrderStatusPage() {
  const { t } = useTranslation();
  
 

  return (
    <>
      <Helmet>
        <title>{t("orderStatus.pageTitle")}</title>
        <meta name="description" content={t("orderStatus.pageDescription")} />
      </Helmet>
      <div className="container flex mx-auto justify-center px-4 py-8">
        <OrderSummary1 />
      </div>
    </>
  );
}
