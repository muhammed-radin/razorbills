import React from "react";

import { useTranslation } from "react-i18next";
import OrderHistory1 from "@/components/order-history-1";
import { orders } from "./data/order-history-1-data";

export default function Orderhistory() {
  const { t } = useTranslation();
  return (
   
      <div className="w-full">
        <OrderHistory1 orders={orders} />
      </div>
    
  );
}