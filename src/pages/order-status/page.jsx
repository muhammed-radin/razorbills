import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { OrderSummary1 } from "@/components/blocks/order-summary1";
import { toast } from "sonner";

export default function OrderStatusPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Local mock order data conforming to OrderSummary1 schema
  const orderData = {
    orderNumber: "#ORD-1024",
    orderDate: "July 21, 2026",
    status: "processing", // "confirmed" | "processing" | "shipped" | "delivered"
    email: "customer@razorbills.com",
    items: [
      {
        id: "1",
        name: "Wireless Noise Cancelling Headphones",
        image: "/products/Headphone.jpg",
        price: 4999.0,
        quantity: 1,
        details: [
          { label: "SKU", value: "TECH-HD-09" },
          { label: "Color", value: "Matte Black" },
        ],
      },
    ],
    subtotal: 4999.0,
    shipping: 0.0,
    tax: 0.0,
    discount: 0.0,
    total: 4999.0,
    shippingAddress: {
      name: "John Doe",
      street: "123 Technology Park, Flat 4B",
      city: "Kochi",
      state: "Kerala",
      zipCode: "682001",
      country: "India",
    },
    shippingMethod: "Express Courier Delivery",
    estimatedDelivery: "July 25, 2026",
    paymentMethod: {
      type: "card",
      lastFour: "4242",
      cardBrand: "Visa",
    },
  };

  const handleTrackOrder = () => {
    toast.info("Courier: Bluedart Express (Tracking: RB-IND-894231)");
  };

  const handleDownloadReceipt = () => {
    toast.info(t("orderStatus.downloadingInvoice"));
    setTimeout(() => {
      toast.success(t("orderStatus.invoiceDownloaded"));
    }, 1000);
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleContactSupport = () => {
    toast.info("Support contact: support@razorbills.com");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("orderStatus.title")} - {orderData.orderNumber} - RazorBills</title>
      </Helmet>

      <OrderSummary1
        order={orderData}
        onTrackOrder={handleTrackOrder}
        onDownloadReceipt={handleDownloadReceipt}
        onPrintOrder={handlePrintOrder}
        onContactSupport={handleContactSupport}
        onContinueShopping={handleContinueShopping}
      />
    </div>
  );
}
