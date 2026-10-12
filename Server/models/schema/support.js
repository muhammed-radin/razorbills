import mongoose, { Schema } from "mongoose";

/* =========================================================
 * Customer care tickets. Customers see ONLY their own tickets
 * and customer/admin messages — never internal notes.
 * Every status change is audited.
 * ========================================================= */

export const TicketStatus = Object.freeze({
  OPEN: "open",
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
});

export const TicketCategory = Object.freeze({
  ORDER: "order",
  PAYMENT: "payment",
  DELIVERY: "delivery",
  PRODUCT: "product",
  CANCELLATION: "cancellation",
  RETURN: "return",
  REFUND: "refund",
  OTHER: "other",
});

export const TicketPriority = Object.freeze({
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
});

const TicketMessageSchema = new Schema(
  {
    sender: { type: String, enum: ["user", "admin"], required: true },
    senderId: { type: String, default: null, trim: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false, id: false },
);

const TicketAuditSchema = new Schema(
  {
    action: { type: String, required: true, trim: true },
    actorId: { type: String, default: null, trim: true },
    note: { type: String, default: null, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false, id: false },
);

export const SupportTicketSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    userId: { type: String, required: true, index: true, trim: true },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    category: {
      type: String,
      enum: Object.values(TicketCategory),
      default: TicketCategory.OTHER,
      index: true,
    },
    orderId: { type: String, default: null, trim: true, index: true },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.OPEN,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.NORMAL,
      index: true,
    },
    messages: { type: [TicketMessageSchema], default: [] },
    assignedAdmin: { type: String, default: null, trim: true, index: true },
    resolutionNote: { type: String, default: null, trim: true },
    audit: { type: [TicketAuditSchema], default: [] },
  },
  { timestamps: true },
);

SupportTicketSchema.index({ userId: 1, createdAt: -1 });
SupportTicketSchema.index({ status: 1, createdAt: -1 });
SupportTicketSchema.index({ category: 1, status: 1 });

export const SupportTicketModel = mongoose.model(
  "SupportTicket",
  SupportTicketSchema,
  "support_tickets",
);

export default {
  SupportTicketSchema,
  SupportTicketModel,
  TicketStatus,
  TicketCategory,
  TicketPriority,
};
