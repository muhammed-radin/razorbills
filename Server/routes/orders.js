import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
} from "../utils/middlewares/reqiuredAuth.js";
import { requireAdmin, requirePermission } from "../utils/middlewares/RBAC.js";
import { useMemory } from "../utils/memory.js";
import {
  OrderModel,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  CancellationStatus,
  ReturnStatus,
  RefundStatus,
} from "../models/schema/order.js";

/* =========================================================
 * ORDER API ENDPOINTS
 * ========================================================= */

/*
 * GET    /orders/list
 * Admin permissions [read]
 * Get paginated, filtered, and sorted list of all orders.
 */

/*
 * GET    /orders/:id
 * Client / Admin
 * Get complete order details by order ID.
 */

/*
 * GET    /orders/user-orders
 * Client
 * Get all orders belonging to the authenticated user.
 */

/*
 * POST   /orders
 * Client
 * Create a new order for the authenticated user.
 */

/*
 * GET    /orders/:id/status
 * Client / Admin
 * Get order status, payment status, fulfillment status,
 * cancellation status, return status, refund status,
 * and status history.
 */

/*
 * POST   /orders/:id/cancel
 * Client
 * Request cancellation of the authenticated user's order.
 */

/*
 * POST   /orders/:id/cancel/approve
 * Admin permissions [update]
 * Approve a pending order cancellation request.
 */

/*
 * POST   /orders/:id/cancel/reject
 * Admin permissions [update]
 * Reject a pending order cancellation request.
 */

/*
 * POST   /orders/:id/updateStatus
 * Admin permissions [update]
 * Manually transition the order to a valid order status.
 */

/*
 * POST   /orders/:id/payment/paid
 * Admin permissions [update]
 * Mark an order payment as successfully paid.
 */

/*
 * POST   /orders/:id/payment/failed
 * Admin permissions [update]
 * Mark an order payment as failed.
 */

/*
 * POST   /orders/:id/process
 * Admin permissions [update]
 * Start processing a confirmed order.
 */

/*
 * POST   /orders/:id/packed
 * Admin permissions [update]
 * Mark an order as packed and ready for shipment.
 */

/*
 * POST   /orders/:id/ship
 * Admin permissions [update]
 * Ship an order and update tracking/shipping information.
 */

/*
 * POST   /orders/:id/deliver
 * Admin permissions [update]
 * Mark a shipped order as delivered.
 */

/*
 * POST   /orders/:id/return
 * Client
 * Request a return for the authenticated user's delivered order.
 */

/*
 * POST   /orders/:id/return/approve
 * Admin permissions [update]
 * Approve a customer's return request.
 */

/*
 * POST   /orders/:id/return/reject
 * Admin permissions [update]
 * Reject a customer's return request.
 */

/*
 * POST   /orders/:id/return/received
 * Admin permissions [update]
 * Confirm that the returned package has been received.
 */

/*
 * POST   /orders/:id/return/complete
 * Admin permissions [update]
 * Complete the return process and mark the order as returned.
 */

/*
 * POST   /orders/:id/refund
 * Admin permissions [update]
 * Create/request a refund for an order.
 */

/*
 * POST   /orders/:id/refund/complete
 * Admin permissions [update]
 * Confirm that the refund has been successfully completed.
 */

/*
 * PATCH  /orders/:id/shipping
 * Admin permissions [update]
 * Update courier, tracking number, contact, and shipping information.
 */

/*
 * PATCH  /orders/:id/shipping/estimated-delivery
 * Admin permissions [update]
 * Update the estimated delivery date of an order.
 */

/*
 * GET    /orders/admin/pending
 * Admin permissions [read]
 * Get all pending orders.
 */

/*
 * GET    /orders/admin/processing
 * Admin permissions [read]
 * Get all orders currently being processed.
 */

/*
 * GET    /orders/admin/returns
 * Admin permissions [read]
 * Get all orders with pending return requests.
 */

/*
 * GET    /orders/admin/refunds
 * Admin permissions [read]
 * Get all orders with pending refunds.
 */

/*
 * DELETE /orders/:id
 * Admin permissions [delete]
 * Permanently delete an eligible terminal order.
 */

const router = express.Router();

/* =========================================================
 * CACHE
 * ========================================================= */

const globalMemory = typeof useMemory === "function" ? useMemory() : null;

/* =========================================================
 * HELPERS
 * ========================================================= */

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseNonNegativeInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function getRequestValue(req, key, fallback = undefined) {
  return req.query?.[key] ?? req.body?.[key] ?? fallback;
}

function isValidOrderStatus(status) {
  return Object.values(OrderStatus).includes(status);
}

function isValidPaymentStatus(status) {
  return Object.values(PaymentStatus).includes(status);
}

function isValidFulfillmentStatus(status) {
  return Object.values(FulfillmentStatus).includes(status);
}

/* =========================================================
 * GET /orders/list
 *
 * Admin order listing
 * ========================================================= */

router.get(
  "/list",
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res) => {
    try {
      const realtime = req.query?.realtime === "true";

      const cached = !realtime && globalMemory?.getLocalMemory(req.url);

      if (cached) {
        return res.json(cached);
      }

      const page = parsePositiveInt(getRequestValue(req, "page"), 1);

      const limit = Math.min(
        parsePositiveInt(getRequestValue(req, "limit"), 10),
        100,
      );

      const sortBy = getRequestValue(req, "sortBy", "createdAt");

      const sortOrder = getRequestValue(req, "sortOrder") === "asc" ? 1 : -1;

      const startIndex =
        page > 1
          ? (page - 1) * limit
          : parseNonNegativeInt(getRequestValue(req, "startIndex"), 0);

      /* ---------------------------------------------
       * BUILD FILTER
       * --------------------------------------------- */

      const query = {};

      const status = req.query?.status ?? req.body?.status;

      const userId = req.query?.userId ?? req.body?.userId;

      const paymentStatus = req.query?.paymentStatus ?? req.body?.paymentStatus;

      const fulfillmentStatus =
        req.query?.fulfillmentStatus ?? req.body?.fulfillmentStatus;

      if (status) {
        if (!isValidOrderStatus(status)) {
          return res.status(400).json({
            code: 400,
            error: `Invalid order status: ${status}`,
          });
        }

        query.status = status;
      }

      if (userId) {
        query.userId = userId;
      }

      if (paymentStatus) {
        if (!isValidPaymentStatus(paymentStatus)) {
          return res.status(400).json({
            code: 400,
            error: `Invalid payment status: ${paymentStatus}`,
          });
        }

        query["payment.status"] = paymentStatus;
      }

      if (fulfillmentStatus) {
        if (!isValidFulfillmentStatus(fulfillmentStatus)) {
          return res.status(400).json({
            code: 400,
            error: `Invalid fulfillment status: ${fulfillmentStatus}`,
          });
        }

        query["fulfillment.status"] = fulfillmentStatus;
      }

      /* ---------------------------------------------
       * QUERY
       * --------------------------------------------- */

      const [orders, totalCount] = await Promise.all([
        OrderModel.find(query)
          .sort({
            [sortBy]: sortOrder,
            createdAt: -1,
          })
          .skip(startIndex)
          .limit(limit)
          .lean(),

        OrderModel.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      const result = {
        orders,

        page,
        limit,

        count: totalCount,

        totalPages,

        next: page < totalPages ? page + 1 : null,

        previous: page > 1 ? page - 1 : null,

        startIndex,

        endIndex: startIndex + orders.length - 1,

        sort: {
          by: sortBy,
          order: sortOrder,
        },

        fromCache: false,
      };

      globalMemory?.setLocalMemory(
        req.url,
        {
          ...result,
          fromCache: true,
        },
        60 * 2,
      );

      return res.json(result);
    } catch (err) {
      console.error("Error fetching orders:", err);

      return res.status(500).json({
        code: 500,
        error: "Failed to fetch orders",
      });
    }
  },
);

/* =========================================================
 * GET /user-orders
 *
 * Get orders orderd by user
 * NOTE: must be registered before GET /:id, otherwise "user-orders"
 * is captured as :id and this route is unreachable.
 * ========================================================= */

router.get("/user-orders", requireAuth, passUserAuth, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        code: 401,
        error: "Authenticated user ID is required",
      });
    }

    const orders = await OrderModel.find({
      userId,
    });

    return res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);

    return res.status(500).json({
      code: 500,
      error: "Failed to fetch user orders",
    });
  }
});

/* =========================================================
 * GET /orders/:id
 *
 * Get complete order
 * ========================================================= */

router.get("/:id", requireAuth, passUserAuth, async (req, res) => {
  try {
    const order = await OrderModel.findOne({
      id: req.params.id,
    });

    if (!order) {
      return res.status(404).json({
        code: 404,
        error: "Order not found",
      });
    }

    return res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);

    return res.status(500).json({
      code: 500,
      error: "Failed to fetch order",
    });
  }
});

/* =========================================================
 * POST /orders
 *
 * Create order from user
 * ========================================================= */

router.post("/", requireAuth, passUserAuth, async (req, res) => {
  try {
    const body = req.body ?? {};

    /*
     * Never trust userId from request body.
     *
     * Your passUserAuth middleware should provide
     * the authenticated user ID.
     *
     * Adjust this line to the actual property used
     * by your middleware.
     */
    const userId = req.user?.id ?? body.userId;

    if (!userId) {
      return res.status(401).json({
        code: 401,
        error: "Authenticated user ID is required",
      });
    }

    /* ---------------------------------------------
     * BASIC VALIDATION
     * --------------------------------------------- */

    if (!Array.isArray(body.products) || body.products.length === 0) {
      return res.status(400).json({
        code: 400,
        error: "Order must contain at least one product",
      });
    }

    if (!body.shippingAddress || !body.billingAddress) {
      return res.status(400).json({
        code: 400,
        error: "shippingAddress and billingAddress are required",
      });
    }

    if (!body.payment?.method) {
      return res.status(400).json({
        code: 400,
        error: "payment.method is required",
      });
    }

    /* ---------------------------------------------
     * PRODUCT VALIDATION
     * --------------------------------------------- */

    const invalidProducts = body.products.filter((product) => {
      return (
        !product?.productId ||
        !product?.title ||
        !product?.thumbnail ||
        !product?.sku ||
        !product?.category ||
        !product?.brand ||
        !Number.isFinite(Number(product?.originalPrice)) ||
        !Number.isFinite(Number(product?.price)) ||
        !Number.isInteger(Number(product?.quantity)) ||
        Number(product.quantity) <= 0 ||
        Number(product.price) < 0 ||
        Number(product.originalPrice) < 0
      );
    });

    if (invalidProducts.length > 0) {
      return res.status(400).json({
        code: 8002,
        error: "Invalid product data in order",
        invalidProducts,
      });
    }

    /* ---------------------------------------------
     * NORMALIZE ITEMS
     * --------------------------------------------- */

    const products = body.products.map((product) => ({
      productId: String(product.productId),

      title: String(product.title),

      thumbnail: String(product.thumbnail),

      originalPrice: Number(product.originalPrice),

      price: Number(product.price),

      sku: String(product.sku),

      category: String(product.category),

      brand: String(product.brand),

      quantity: Number(product.quantity),

      specialInfo: product.specialInfo ?? {},

      returnedQuantity: 0,

      refundedQuantity: 0,
    }));

    /* ---------------------------------------------
     * CALCULATE SUBTOTAL
     * --------------------------------------------- */

    const subtotal = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );

    /* ---------------------------------------------
     * DISCOUNT
     *
     * Temporary validation until coupon service
     * is connected.
     * --------------------------------------------- */

    const discountAmount = Math.max(0, Number(body.discount?.amount ?? 0));

    if (discountAmount > subtotal) {
      return res.status(400).json({
        code: 8003,
        error: "Discount cannot exceed subtotal",
      });
    }

    const discount = {
      codes: Array.isArray(body.discount?.codes) ? body.discount.codes : [],

      amount: discountAmount,
    };

    /* ---------------------------------------------
     * TAX
     *
     * tax = percentage
     * taxAmount = actual money
     * --------------------------------------------- */

    const tax = Math.max(0, Number(body.tax ?? 0));

    const taxableAmount = subtotal - discount.amount;

    const calculatedTaxAmount = Number(
      (taxableAmount * (tax / 100)).toFixed(2),
    );

    /* ---------------------------------------------
     * SHIPPING
     * --------------------------------------------- */

    const shippingAmount = Math.max(0, Number(body.shippingAmount ?? 0));

    /* ---------------------------------------------
     * TOTAL
     * --------------------------------------------- */

    const calculatedTotalAmount = Number(
      (taxableAmount + calculatedTaxAmount + shippingAmount).toFixed(2),
    );

    /* ---------------------------------------------
     * OPTIONAL CLIENT TOTAL VALIDATION
     *
     * If the frontend sends totalAmount, verify it.
     * Server calculation remains authoritative.
     * --------------------------------------------- */

    if (
      body.totalAmount !== undefined &&
      Number(body.totalAmount) !== calculatedTotalAmount
    ) {
      return res.status(400).json({
        code: 8001,
        error:
          "Invalid order data, totalAmount does not match server calculation",

        expected: calculatedTotalAmount,

        received: Number(body.totalAmount),
      });
    }

    /* ---------------------------------------------
     * CREATE ORDER DATA
     * --------------------------------------------- */

    const orderData = {
      id:
        body.id ??
        `ORD-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)
          .toUpperCase()}`,

      userId,

      products,

      subtotal,

      discount,

      tax,

      taxAmount: calculatedTaxAmount,

      shippingAmount,

      totalAmount: calculatedTotalAmount,

      currency: body.currency ?? "INR",

      status: OrderStatus.PENDING,

      payment: {
        method: body.payment.method,

        status: PaymentStatus.PENDING,

        transactionId: body.payment?.transactionId ?? null,

        amountPaid: 0,

        refundedAmount: 0,
      },

      fulfillment: {
        status: FulfillmentStatus.UNFULFILLED,
      },

      cancellation: {
        status: CancellationStatus.NONE,
      },

      return: {
        status: ReturnStatus.NONE,
      },

      refund: {
        status: RefundStatus.NONE,
      },

      /*
       * Copy addresses as order snapshots.
       */
      shippingAddress: body.shippingAddress,

      billingAddress: body.billingAddress,
    };

    /* ---------------------------------------------
     * CREATE
     * --------------------------------------------- */

    const order = await OrderModel.create(orderData);

    /* ---------------------------------------------
     * USER STATISTICS
     * --------------------------------------------- */

    /*
     * This should ideally be handled together with
     * your order creation workflow / event system.
     */
    try {
      await db.collection("users").updateOne(
        { id: userId },
        {
          $inc: {
            totalOrders: 1,
          },
        },
      );
    } catch (userErr) {
      /*
       * Don't destroy the successful order response
       * merely because a secondary statistic update
       * failed.
       */
      console.error("Failed to update user order statistics:", userErr);
    }

    return res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);

    if (err?.code === 11000) {
      return res.status(409).json({
        code: 11000,
        error: "Order ID already exists",
      });
    }

    return res.status(500).json({
      code: 500,
      error: "Failed to create order",
    });
  }
});

/* =========================================================
 * GET /orders/:id/status
 * ========================================================= */

router.get("/:id/status", requireAuth, passUserAuth, async (req, res) => {
  try {
    const order = await OrderModel.findOne({
      id: req.params.id,
    }).select(
      "id userId status statusHistory payment.status fulfillment.status cancellation.status return.status refund.status createdAt updatedAt",
    );

    if (!order) {
      return res.status(404).json({
        code: 404,
        error: "Order not found",
      });
    }

    /*
     * User ownership check.
     *
     * Admins may access any order.
     */
    const isAdmin = req.user?.role === "admin" || req.user?.role === "owner";

    if (!isAdmin && order.userId !== req.user?.id) {
      return res.status(403).json({
        code: 403,
        error: "Access denied",
      });
    }

    return res.json({
      id: order.id,

      status: order.status,

      paymentStatus: order.payment?.status,

      fulfillmentStatus: order.fulfillment?.status,

      cancellationStatus: order.cancellation?.status,

      returnStatus: order.return?.status,

      refundStatus: order.refund?.status,

      statusHistory: order.statusHistory,

      createdAt: order.createdAt,

      updatedAt: order.updatedAt,
    });
  } catch (err) {
    console.error("Error fetching order status:", err);

    return res.status(500).json({
      code: 500,
      error: "Failed to fetch order status",
    });
  }
});

/* =========================================================
 * POST /orders/:id/cancel
 *
 * Customer cancellation request
 * ========================================================= */

router.post("/:id/cancel", requireAuth, passUserAuth, async (req, res) => {
  try {
    const order = await OrderModel.findOne({
      id: req.params.id,
    });

    if (!order) {
      return res.status(404).json({
        code: 404,
        error: "Order not found",
      });
    }

    if (order.userId !== req.user?.id) {
      return res.status(403).json({
        code: 403,
        error: "Access denied",
      });
    }

    if (!order.canCancel()) {
      return res.status(400).json({
        code: 400,
        error: `Order cannot be cancelled from status: ${order.status}`,
      });
    }

    const updatedOrder = await order.requestCancellation({
      reason: req.body?.reason ?? null,

      actorId: req.user?.id ?? null,
    });

    return res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error requesting cancellation:", err);

    return res.status(500).json({
      code: 500,
      error: "Failed to request cancellation",
    });
  }
});

/* =========================================================
 * POST /orders/:id/cancel/approve
 *
 * Admin
 * ========================================================= */

router.post(
  "/:id/cancel/approve",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.approveCancellation({
        actorId: req.user?.id ?? null,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error approving cancellation:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/cancel/reject
 *
 * Admin
 * ========================================================= */

router.post(
  "/:id/cancel/reject",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.rejectCancellation({
        reason: req.body?.reason ?? null,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error rejecting cancellation:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/status
 *
 * Admin generic status transition
 * ========================================================= */

router.post(
  "/:id/updateStatus",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const { status, note = null, validate = true } = req.body ?? {};

      if (!status) {
        return res.status(400).json({
          code: 400,
          error: "status is required",
        });
      }

      if (!isValidOrderStatus(status)) {
        return res.status(400).json({
          code: 400,
          error: `Invalid order status: ${status}`,
        });
      }

      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.transitionTo(status, {
        note,
        actor: "admin",
        actorId: req.user?.id ?? null,
        validate: validate !== false,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error updating order status:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/payment/paid
 * ========================================================= */

router.post(
  "/:id/payment/paid",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.markAsPaid({
        transactionId: req.body?.transactionId ?? null,

        amount:
          req.body?.amount !== undefined
            ? Number(req.body.amount)
            : order.totalAmount,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error marking order as paid:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/payment/failed
 * ========================================================= */

router.post(
  "/:id/payment/failed",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.markPaymentFailed(
        req.body?.reason ?? null,
      );

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error marking payment failed:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/process
 * ========================================================= */

router.post(
  "/:id/process",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.startProcessing({
        actor: "admin",
        actorId: req.user?.id ?? null,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error processing order:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/packed
 * ========================================================= */

router.post(
  "/:id/packed",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.markAsPacked();

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error packing order:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/ship
 * ========================================================= */

router.post(
  "/:id/ship",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.markAsShipped({
        trackingNumber: req.body?.trackingNumber ?? null,

        serviceName: req.body?.serviceName ?? null,

        contactNumber: req.body?.contactNumber ?? null,

        email: req.body?.email ?? null,

        estimatedDelivery: req.body?.estimatedDelivery ?? null,

        actor: "admin",

        actorId: req.user?.id ?? null,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error shipping order:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/deliver
 * ========================================================= */

router.post(
  "/:id/deliver",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.markAsDelivered({
        actor: "admin",
        actorId: req.user?.id ?? null,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error delivering order:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/return
 *
 * Customer requests return
 * ========================================================= */

router.post("/:id/return", requireAuth, passUserAuth, async (req, res) => {
  try {
    const order = await OrderModel.findOne({
      id: req.params.id,
    });

    if (!order) {
      return res.status(404).json({
        code: 404,
        error: "Order not found",
      });
    }

    if (order.userId !== req.user?.id) {
      return res.status(403).json({
        code: 403,
        error: "Access denied",
      });
    }

    const updatedOrder = await order.requestReturn({
      reason: req.body?.reason ?? null,
    });

    return res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error requesting return:", err);

    return res.status(400).json({
      code: 400,
      error: err.message,
    });
  }
});

/* =========================================================
 * POST /orders/:id/return/approve
 * ========================================================= */

router.post(
  "/:id/return/approve",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.approveReturn({
        actorId: req.user?.id ?? null,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error approving return:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/return/reject
 * ========================================================= */

router.post(
  "/:id/return/reject",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.rejectReturn({
        reason: req.body?.reason ?? null,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error rejecting return:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/return/received
 * ========================================================= */

router.post(
  "/:id/return/received",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.markReturnReceived();

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error receiving return:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/return/complete
 * ========================================================= */

router.post(
  "/:id/return/complete",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.completeReturn({
        actorId: req.user?.id ?? null,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error completing return:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/refund
 *
 * Create refund request
 * ========================================================= */

router.post(
  "/:id/refund",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const amount =
        req.body?.amount !== undefined
          ? Number(req.body.amount)
          : order.getRemainingRefundAmount();

      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
          code: 400,
          error: "Invalid refund amount",
        });
      }

      const updatedOrder = await order.requestRefund({
        amount,
        reason: req.body?.reason ?? null,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error requesting refund:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * POST /orders/:id/refund/complete
 * ========================================================= */

router.post(
  "/:id/refund/complete",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.completeRefund({
        transactionId: req.body?.transactionId ?? null,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error completing refund:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * PATCH /orders/:id/shipping
 * ========================================================= */

router.patch(
  "/:id/shipping",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.updateShipmentInfo({
        serviceName: req.body?.serviceName,

        contactNumber: req.body?.contactNumber,

        email: req.body?.email,

        trackingNumber: req.body?.trackingNumber,
      });

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error updating shipping info:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * PATCH /orders/:id/shipping/estimated-delivery
 * ========================================================= */

router.patch(
  "/:id/shipping/estimated-delivery",
  requireAuth,
  requireAdmin,
  requirePermission("update"),
  async (req, res) => {
    try {
      const { estimatedDate } = req.body ?? {};

      if (!estimatedDate) {
        return res.status(400).json({
          code: 400,
          error: "estimatedDate is required",
        });
      }

      const date = new Date(estimatedDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          code: 400,
          error: "Invalid estimated delivery date",
        });
      }

      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      const updatedOrder = await order.updateEstimatedDelivery(date);

      return res.json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error updating estimated delivery:", err);

      return res.status(400).json({
        code: 400,
        error: err.message,
      });
    }
  },
);

/* =========================================================
 * ADMIN SHORTCUTS
 * ========================================================= */

router.get(
  "/admin/pending",
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res) => {
    try {
      const orders = await OrderModel.getPendingOrders();

      return res.json({
        count: orders.length,
        orders,
      });
    } catch (err) {
      console.error("Error fetching pending orders:", err);

      return res.status(500).json({
        code: 500,
        error: "Failed to fetch pending orders",
      });
    }
  },
);

router.get(
  "/admin/processing",
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res) => {
    try {
      const orders = await OrderModel.getProcessingOrders();

      return res.json({
        count: orders.length,
        orders,
      });
    } catch (err) {
      console.error("Error fetching processing orders:", err);

      return res.status(500).json({
        code: 500,
        error: "Failed to fetch processing orders",
      });
    }
  },
);

router.get(
  "/admin/returns",
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res) => {
    try {
      const orders = await OrderModel.getReturnRequests();

      return res.json({
        count: orders.length,
        orders,
      });
    } catch (err) {
      console.error("Error fetching return requests:", err);

      return res.status(500).json({
        code: 500,
        error: "Failed to fetch return requests",
      });
    }
  },
);

router.get(
  "/admin/refunds",
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res) => {
    try {
      const orders = await OrderModel.getPendingRefunds();

      return res.json({
        count: orders.length,
        orders,
      });
    } catch (err) {
      console.error("Error fetching pending refunds:", err);

      return res.status(500).json({
        code: 500,
        error: "Failed to fetch pending refunds",
      });
    }
  },
);

/* =========================================================
 * DELETE /orders/:id
 *
 * Prefer archive instead of physical deletion.
 * Kept here only if your admin system explicitly needs it.
 * ========================================================= */

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  requirePermission("delete"),
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({
        id: req.params.id,
      });

      if (!order) {
        return res.status(404).json({
          code: 404,
          error: "Order not found",
        });
      }

      if (!order.isTerminal()) {
        return res.status(400).json({
          code: 400,
          error: "Only completed/cancelled orders can be deleted.",
        });
      }

      await OrderModel.deleteOne({
        id: req.params.id,
      });

      return res.json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting order:", err);

      return res.status(500).json({
        code: 500,
        error: "Failed to delete order",
      });
    }
  },
);

export default router;
