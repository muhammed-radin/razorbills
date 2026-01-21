const { Schema } = require("mongoose");
const { Product } = require("../product");
const mongoose = require("mongoose");
const { is } = require("zod/v4/locales");

const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  products: {
    type: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        Thumbnail: { type: String, required: true },
        originalPrice: { type: Number, required: true },
        sku: { type: String, required: true },
        category: { type: String, required: true },
        brand: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },

  isPaid: { type: Boolean, default: false },
  isShipped: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  isCancelled: { type: Boolean, default: false },
  isReturned: { type: Boolean, default: false },
  isRefunded: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: "Processing" },
  shippingAddress: { type: String, required: true },
  billingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  trackingNumber: { type: String, default: null },
  estimatedDelivery: { type: Date, default: null },

  shippedAt: { type: Date, default: null },
  deliveredAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
  returnedAt: { type: Date, default: null },
  refundedAt: { type: Date, default: null },

  deliveryServiceInfo: {
    serviceName: { type: String, default: null },
    contactNumber: { type: String, default: null },
    email: { type: String, default: null },
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/* Utility Methods */

OrderSchema.methods.markAsPaid = function () {
  this.isPaid = true;
  this.status = "Paid";
  return this.save();
};

OrderSchema.methods.markAsShipped = function (trackingNumber) {
  this.isShipped = true;
  this.status = "Shipped";
  this.trackingNumber = trackingNumber;
  this.shippedAt = new Date();
  return this.save();
};

OrderSchema.methods.markAsDelivered = function () {
  this.completed = true;
  this.status = "Delivered";
  this.deliveredAt = new Date();
  return this.save();
}

OrderSchema.methods.cancelOrder = function () {
  this.isCancelled = true;
  this.status = "Cancelled";
  this.cancelledAt = new Date();
  return this.save();
};

OrderSchema.methods.returnOrder = function () {
  this.isReturned = true;
  this.status = "Returned";
  this.returnedAt = new Date();
  return this.save();
};

OrderSchema.methods.refundOrder = function () {
  this.isRefunded = true;
  this.status = "Refunded";
  this.refundedAt = new Date();
  return this.save();
};

// Main Methods
OrderSchema.statics.createOrder = function (orderData) {
  const order = new this(orderData);
  return order.save();
};

const OrderModel = mongoose.model("Order", OrderSchema, "orders");

module.exports = { OrderSchema, OrderModel };