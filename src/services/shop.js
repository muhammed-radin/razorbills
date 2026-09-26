import { api } from "@/utils/api";

const unwrap = (promise) => promise.then((res) => res.data);
const get = (url, config) => unwrap(api.client.get(url, config));
const post = (url, body, config) => unwrap(api.client.post(url, body, config));
const put = (url, body, config) => unwrap(api.client.put(url, body, config));
const patch = (url, body, config) =>
  unwrap(api.client.patch(url, body, config));
const del = (url, config) => unwrap(api.client.delete(url, config));

export const cartApi = {
  get: () => get("/api/cart"),
  add: (productId, quantity = 1) => post("/api/cart", { productId, quantity }),
  remove: (productId) => del("/api/cart", { data: { productId } }),
  clear: () => del("/api/cart/clear"),
  setQuantity: (productId, quantity) =>
    put("/api/cart", { productId, quantity }),
};

export const wishlistApi = {
  get: (folder = "/") => get("/api/wishlists", { params: { folder } }),
  add: (product, folder = "/") => post("/api/wishlists", { product, folder }),
  remove: (productId, folder = "/") =>
    del("/api/wishlists", { data: { productId, folder } }),
};

export const addressApi = {
  list: () => get("/api/address"),
  current: () => get("/api/address/current"),
  add: (address) => post("/api/address", { address }),
  setCurrent: (address) => put("/api/address", { address }),
};

export const ordersApi = {
  list: (params) => get("/api/orders/list", { params }),
  get: (id) => get(`/api/orders/${id}`),
  userOrders: () => get("/api/orders/user-orders"),
  create: (payload) => post("/api/orders", payload),
  status: (id) => get(`/api/orders/${id}/status`),
  cancel: (id, reason) => post(`/api/orders/${id}/cancel`, { reason }),
  approveCancel: (id) => post(`/api/orders/${id}/cancel/approve`),
  rejectCancel: (id, reason) =>
    post(`/api/orders/${id}/cancel/reject`, { reason }),
  updateStatus: (id, status, note) =>
    post(`/api/orders/${id}/updateStatus`, { status, note }),
  markPaid: (id, transactionId, amount) =>
    post(`/api/orders/${id}/payment/paid`, { transactionId, amount }),
  markFailed: (id, reason) =>
    post(`/api/orders/${id}/payment/failed`, { reason }),
  process: (id) => post(`/api/orders/${id}/process`),
  packed: (id) => post(`/api/orders/${id}/packed`),
  ship: (id, shipment) => post(`/api/orders/${id}/ship`, shipment),
  deliver: (id) => post(`/api/orders/${id}/deliver`),
  requestReturn: (id, reason) => post(`/api/orders/${id}/return`, { reason }),
  approveReturn: (id) => post(`/api/orders/${id}/return/approve`),
  rejectReturn: (id, reason) =>
    post(`/api/orders/${id}/return/reject`, { reason }),
  returnReceived: (id) => post(`/api/orders/${id}/return/received`),
  completeReturn: (id) => post(`/api/orders/${id}/return/complete`),
  requestRefund: (id, amount, reason) =>
    post(`/api/orders/${id}/refund`, { amount, reason }),
  completeRefund: (id, transactionId) =>
    post(`/api/orders/${id}/refund/complete`, { transactionId }),
  patchShipping: (id, shipment) =>
    patch(`/api/orders/${id}/shipping`, shipment),
  patchEta: (id, estimatedDate) =>
    patch(`/api/orders/${id}/shipping/estimated-delivery`, { estimatedDate }),
  pending: () => get("/api/orders/admin/pending"),
  processing: () => get("/api/orders/admin/processing"),
  returns: () => get("/api/orders/admin/returns"),
  refunds: () => get("/api/orders/admin/refunds"),
  remove: (id) => del(`/api/orders/${id}`),
};

export const commentsApi = {
  list: (productId, params) => get(`/api/comments/${productId}`, { params }),
  create: (productId, content, rating) =>
    post("/api/comments", { productId, content, rating: rating ?? 0 }),
  update: (productId, content) =>
    put(`/api/comments/${productId}`, { content }),
  remove: (productId) => del(`/api/comments/${productId}`),
};

export const interactionsApi = {
  visit: (productId) => post("/api/interactions/product/visit", { productId }),
  share: (productId) => post("/api/interactions/product/share", { productId }),
  rate: (productId, rating) =>
    post("/api/interactions/product/rate", { productId, rating }),
  mine: (productId) => get(`/api/interactions/p/${productId}`),
};

export const productsApi = {
  list: (params) => get("/api/products", { params }),
  get: (id, params) => get(`/api/products/${id}`, { params }),
  similar: (id, params) => get(`/api/products/similar/${id}`, { params }),
  feed: () => get("/api/products/feed"),
  status: (params) => get("/api/products/status", { params }),
};

export const usersApi = {
  profile: () => get("/api/users/profile"),
  list: (params) => get("/api/users", { params }),
  get: (id) => get(`/api/users/${id}`),
};

export const settingsApi = {
  get: () => get("/api/users/settings"),
  save: (prefs) => post("/api/users/settings", prefs),
};

export const analyticsApi = {
  global: () => get("/api/analytics"),
  daily: (dayid) => get(`/api/analytics/${dayid}`),
  events: (params) => get("/api/analytics/events", { params }),
  report: (params) => get("/api/analytics/report", { params }),
};
