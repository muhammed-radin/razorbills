import EventEmitter from "../models/event.js";

const globalEvents = new EventEmitter();
const dbEvents = new EventEmitter();

class DatabaseDocumentEvent {
  constructor(type, collection, document, eventData = null) {
    this.type = type;
    this.collection = collection;
    this.document = document;
    this.data = eventData;
    this.timestamp = new Date();
  }
}

const dbEventNames = {
  // Database connection events
  CONNECTED: "db_connected",
  DISCONNECTED: "db_disconnected",
  ERROR: "db_error",
  CONNECTING: "db_connecting",

  // Database actions events
  DOCUMENT_CREATED: "document_created",
  DOCUMENT_READ: "document_read",
  DOCUMENT_UPDATED: "document_updated",
  DOCUMENT_DELETED: "document_deleted",

  COLLECTION_DROPPED: "collection_dropped",
  DATABASE_DROPPED: "database_dropped",
};

const GlobalEventNames = {
  // Product events
  PRODUCT_CREATED: "product_created",
  PRODUCT_UPDATED: "product_updated",
  PRODUCT_DELETED: "product_deleted",

  // Product interaction events
  PRODUCT_VIEWED: "product_viewed",
  PRODUCT_RATED: "product_rated",
  PRODUCT_SHARED: "product_shared",
  PRODUCT_WISHLISTED: "product_wishlisted",
  PRODUCT_CARTED: "product_carted",
  PRODUCT_COMMENTED: "product_commented",

  // User events
  USER_REGISTERED: "user_registered",
  USER_LOGGED_IN: "user_logged_in",
  USER_LOGGED_OUT: "user_logged_out",
  USER_PROFILE_UPDATED: "user_profile_updated",
  USER_PASSWORD_CHANGED: "user_password_changed",
  USER_DELETED: "user_deleted",

  // Order events
  ORDER_PLACED: "order_placed",
  ORDER_UPDATED: "order_updated",
  ORDER_CANCELLED: "order_cancelled",
  ORDER_COMPLETED: "order_completed",

  // Analytics events
  ANALYTICS_UPDATED: "analytics_updated",
};

export {
  dbEventNames,
  globalEvents as evt,
  dbEvents,
  DatabaseDocumentEvent,
  GlobalEventNames as Evts,
};
