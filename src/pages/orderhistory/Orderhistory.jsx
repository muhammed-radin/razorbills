import React, { useEffect } from "react";

import OrderHistory1 from "@/components/order-history-1";
import { useOrderStore } from "@/stores/shop";

export default function Orderhistory() {
  const orders = useOrderStore((s) => s.orders);
  const loading = useOrderStore((s) => s.loading);
  const fetchUserOrders = useOrderStore((s) => s.fetchUserOrders);

  useEffect(() => {
    fetchUserOrders().catch(() => {});
  }, [fetchUserOrders]);

  return (
    <div className="w-full">
      <OrderHistory1 orders={orders} loading={loading} />
    </div>
  );
}
