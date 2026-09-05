import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
} from "../utils/middlewares/reqiuredAuth.js";
import { requireAdmin, requirePermission } from "../utils/middlewares/RBAC.js";
import { useMemory } from "../utils/memory.js";
import { OrderModel } from "../models/schema/order.js";

const router = express.Router();

router.get(
  "/list",
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  async function (req, res) {
    if (
      globalMemory?.getLocalMemory(req.url) &&
      req.query?.realtime !== "true"
    ) {
      return res.json(globalMemory.getLocalMemory(req.url));
    }
    let query = {};
    let result = {};
    let page = parseInt(req.query?.page) || parseInt(req.body?.page) || 1;
    let limit = parseInt(req.query?.limit) || parseInt(req.body?.limit) || 10;
    let sortBy = req.query?.sortBy || req.body?.sortBy || "createdAt";
    let sortOrder = req.query?.sortOrder === "asc" ? 1 : -1;
    let startIndex =
      parseInt(req.query?.startIndex) || parseInt(req.body?.startIndex) || 0;

    if (page > 1) {
      startIndex = (page - 1) * limit;
    }

    // build query based on request parameters
    query = {
      // null query for now, can be extended later
    };

    let totalCount = await db.collection("orders").countDocuments(query);

    db.collection("orders")
      .find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ [sortBy]: sortOrder, createdAt: -1 })
      .toArray()
      .then((orders) => {
        result = {
          orders: orders,
          page: page,
          limit: limit,
          count: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          next: page < Math.ceil(totalCount / limit) ? page + 1 : null,
          previous: page > 1 ? page - 1 : null,
          startIndex: startIndex,
          endIndex: startIndex + orders.length - 1,
          sort: {
            by: sortBy,
            order: sortOrder,
          },
          fromCache: false,
        };

        globalMemory?.setLocalMemory(
          req.url,
          { ...result, fromCache: true },
          60 * 2,
        ); // Cache for 2 minutes
        res.json(result);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
      });
  },
);

router.get(
  "/:id",
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  function (req, res) {
    const orderId = req.params.id;

    db.collection("orders")
      .findOne({ id: orderId })
      .then((order) => {
        if (!order) {
          return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
        res.status(500).json({ error: "Failed to fetch order" });
      });
  },
);

// orders create from user
router.post("/", requireAuth, passUserAuth, function (req, res) {
  const order = req.body;

  if (!order) {
    return res.status(400).json({ error: "Order data is required" });
  }

  if (
    !order.userId ||
    !order.products ||
    !Array.isArray(order.products) ||
    order.products.length === 0
  ) {
    return res.status(400).json({
      code: 400,
      error: "Invalid order data, missing user and products",
    });
  }

  if (!order.shippingAddress || !order.billingAddress || !order.paymentMethod) {
    return res.status(400).json({
      code: 400,
      error:
        "Missing required order fields. shippingAddress, billingAddress, and paymentMethod are required",
    });
  }

  if (!order.totalAmount || !order.tax) {
    return res.status(400).json({
      code: 400,
      error: "Missing required order fields. totalAmount and tax are required",
    });
  }

  // validate totalAmount === calucalted totalAmount
  const calculatedTotalAmount = order.products.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );
  if (order.totalAmount !== calculatedTotalAmount) {
    return res.status(400).json({
      code: 8001,
      error:
        "Invalid order data, totalAmount does not match calculated totalAmount",
    });
  }
  if (order.discount && order.discount?.codes && order.discount?.amount > 0) {
    const discountedTotal = calculatedTotalAmount - order.discount.amount;
    // validate discount coupne codes and amount.
    // do it later, for now just check if discountedTotal is less than 0
    // TODO: validate discount codes and amount with coupon service
  }

  if (order.tax && order.tax?.amount > 0) {
    // validate tax amount
    // do it later, for now just check if tax amount is greater than 0
    // TODO: validate tax amount with tax service
  }

  // check products have minimum required fields and values
  const invalidProducts = order.products.map((product) => {
    if (
      !product.productId ||
      !product.title ||
      !product.thumbnail ||
      !product.originalPrice ||
      !product.sku ||
      !product.category ||
      !product.brand ||
      !product.quantity ||
      !product.price ||
      product.quantity <= 0 ||
      product.price <= 0 ||
      product.originalPrice <= 0
    ) {
      return product;
    }
  });

  if (invalidProducts.length > 0) {
    return res.status(400).json({
      code: 8002,
      error: "Invalid product data in order",
      invalidProducts: invalidProducts,
    });
  }

  OrderModel.create(order)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error("Error creating order:", err);
      res.status(500).json({ code: 500, error: "Failed to create order" });
    });
});

export default router;
