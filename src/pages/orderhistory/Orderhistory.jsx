import React from "react";

import { useTranslation } from "react-i18next";
import OrderHistory1 from "@/components/order-history-1";
import { orders } from "./data/order-history-1-data";

export default function Orderhistory() {
  const { t } = useTranslation();
  return (
    // <div className="min-h-screen w-full max-w-full overflow-x-hidden">
    //   <div className="max-w-5xl flex flex-col mx-auto items-center px-4">
    //     <div className="flex justify-center items-center gap-4 my-4">
    //       <h1 className="text-2xl font-semibold tracking-tight">
    //         {t("orders.title")}
    //       </h1>
    //     </div>

    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-5 w-full min-w-0">
    //       <OrderCard />
    //       <OrderCard />
    //       <OrderCard />
    //       <OrderCard />
    //       <OrderCard />
    //       <OrderCard />
    //       <OrderCard />
    //     </div>
    //   </div>
    // </div>
     <div className="flex flex-col min-h-svh w-full items-center justify-center">
    
      <div className="w-full">
        <OrderHistory1 orders={orders} />
      </div>
    </div>
  );
}