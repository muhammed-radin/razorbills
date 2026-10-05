import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { OrderSummary1 } from "@/components/order-summary1";
import { useOrderStore } from "@/stores/shop";

export default function OrderStatusPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const orderId = params.get("id");
  const detail = useOrderStore((s) => s.detail);
  const fetchDetail = useOrderStore((s) => s.fetchDetail);

  useEffect(() => {
    if (orderId) fetchDetail(orderId).catch(() => {});
  }, [orderId, fetchDetail]);

  const order = useMemo(() => {
    if (!orderId || !detail) return undefined;
    const products = detail.products ?? [];
    const subtotal = products.reduce(
      (sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 1),
      0,
    );
    return {
      orderNumber: detail.id ?? detail._id ?? orderId,
      orderDate: detail.createdAt
        ? new Date(detail.createdAt).toLocaleDateString()
        : "",
      status: detail.status ?? "pending",
      email: detail.userEmail ?? detail.email ?? "",
      items: products.map((p, i) => ({
        id: p.productId ?? String(i),
        name: p.title ?? "Product",
        image: p.thumbnail ?? "",
        price: p.price ?? 0,
        quantity: p.quantity ?? 1,
        details: [
          { label: "SKU", value: p.sku ?? "—" },
          { label: "Category", value: p.category ?? "—" },
        ],
      })),
      subtotal,
      shipping: detail.shippingAmount ?? 0,
      tax: detail.taxAmount ?? 0,
      discount: detail.discount?.amount ?? 0,
      total: detail.totalAmount ?? subtotal,
      shippingAddress: {
        name: detail.shippingAddress?.name ?? "",
        street:
          detail.shippingAddress?.address ??
          detail.shippingAddress?.street ??
          "",
        city: detail.shippingAddress?.city ?? "",
        state: detail.shippingAddress?.state ?? "",
        zipCode:
          detail.shippingAddress?.pincode ??
          detail.shippingAddress?.zipCode ??
          "",
        country: detail.shippingAddress?.country ?? "India",
      },
      shippingMethod: detail.shippingMethod ?? "Standard Shipping",
      estimatedDelivery: detail.estimatedDelivery ?? "",
      paymentMethod: {
        type: detail.payment?.method ?? "upi",
        lastFour: "",
        cardBrand: "",
      },
    };
  }, [orderId, detail]);

  return (
    <>
      <Helmet>
        <title>{t("orderStatus.pageTitle")}</title>
        <meta name="description" content={t("orderStatus.pageDescription")} />
      </Helmet>
      <div className="container flex mx-auto justify-center px-4 py-8">
        <OrderSummary1 order={order} />
      </div>
    </>
  );
}
