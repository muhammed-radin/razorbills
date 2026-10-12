# Analytics Events & Metric Definitions

Single source of truth for the event taxonomy. Server-generated events are
authoritative for money and fulfillment; browser events are informational
only and never prove a purchase or payment.

## Authoritative (server) event flow

Checkout → order → payment → shipment → delivery:

1. `order_create_attempt` — POST /orders received (userId only, no PII).
2. `checkout_started` + `payment_initiated` — attempt created
   (server-priced cart snapshot; NOT an order).
3. `order_placed` — order persisted with server-validated totals.
   COD additionally fires `cod_created` + `cod_collection_pending`.
3. `payment_initiated` — Razorpay gateway order created (or stub).
4. `payment_succeeded` — ONLY after HMAC verify or verified webhook.
   `payment_failed` / `payment_cancelled` / `payment_verification_failed`
   on the respective outcomes.
5. `payment_webhook_received` → `payment_webhook_verified` (or
   `payment_duplicate_ignored` on redelivery).
6. `shipment_serviceability_check` → `shipment_create_attempt` →
   `shipment_created` (or `shipment_create_failed` with reason; stubs
   included) → `shipment_pickup` / `shipment_in_transit` /
   `shipment_out_for_delivery` / `shipment_delivered` /
   `shipment_cancelled` / `shipment_rto` → `shipment_track_synced`.
7. `cod_collected` (or `cod_collection_failed`) via admin-only collect.
8. `order_status_changed`, `order_create_failed` on lifecycle/failure paths.

Pre-existing events (`order_updated/cancelled/completed/return_requested`,
cart/wishlist/product/user/session events) are unchanged and still fire
from their original call sites. New in this cycle:
`checkout_started`, `order_status_changed`,
`ticket_created/replied/resolved/reopened/closed` (ids only, never message
bodies), `search_submitted` / `search_rate_limited` (taxonomy reserved;
product search already emits `site_searched`).

## Deduplication & double-counting rules

- Order creation: `X-Idempotency-Key` header (or `idempotencyKey` body).
  Same key + user returns the original order (`deduplicated:true`).
- Payment verify: same `razorpay_payment_id` processed once; repeats return
  `deduplicated:true` and fire `payment_duplicate_ignored`.
- Webhooks: `(provider, eventId)` persisted in `webhook_events`; redeliveries
  short-circuit before mutating orders.
- Shipment create: refuses when `shipmozoOrderId`/`awb` already set unless
  admin passes `force:true`.
- Analytics handlers are fire-and-forget: an event failure never fails the
  order/payment/shipment write (see `safeEvent` wrappers).

## Metric definitions (`GET /api/analytics/orders-summary`)

- `revenue` = Σ `totalAmount` WHERE `payment.status = paid`.
  Unpaid COD is never revenue.
- `paidOrders` = count WHERE `payment.status = paid`.
- `aov` = `revenue / paidOrders` (null when zero).
- `cod.pendingCollection` = Σ `totalAmount` WHERE `method = cod` AND
  `codStatus = pending_collection`.
- `cod.collected` = Σ `amountPaid` WHERE `method = cod` AND
  `codStatus = collected`.
- `byStatus` / `byPaymentMethod` = counts in the requested date range
  (`createdAt`, UTC, end-exclusive).
- `shipments` = counts by `fulfillment.status`.
- `series` = per day/week/month buckets `{ orders, revenue }`
  (revenue bucket uses the paid-only rule).

## Privacy

Events carry ids, statuses, amounts, pincodes-level courier data only.
No passwords, tokens, API secrets, full card details, Razorpay secrets,
or Shipmozo keys are ever written to analytics records or logs.
