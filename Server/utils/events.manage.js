import EventEmitter, { ClassicEvent } from "../models/event.js";

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

class ProductEvent extends ClassicEvent {
  constructor({ type, product }) {
    super(type);
    this.gloabl = true;
    this.product = product;
  }
}

class CommentEvent extends ClassicEvent {
  constructor({ type, comment }) {
    super(type);
    this.gloabl = true;
    this.comment = comment;
  }
}

class ErrorEvent extends ClassicEvent {
  constructor({ type, error, errorCode = null, data = null }) {
    super(type);
    this.gloabl = true;
    this.error = error;
    this.errorCode = errorCode;
    this.data = data;
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
  PRODUCT_COMMENT_UPDATED: "product_comment_updated",
  PRODUCT_COMMENT_DELETED: "product_comment_deleted",
  PRODUCT_COMMENT_ERROR: "product_comment_error",

  // User events
  USER_REGISTERED: "user_registered",
  USER_LOGGED_IN: "user_logged_in",
  USER_LOGGED_OUT: "user_logged_out",
  USER_PROFILE_UPDATED: "user_profile_updated",
  USER_PASSWORD_CHANGED: "user_password_changed",
  USER_DELETED: "user_deleted",

  // Wihlist events
  WISHLIST_REMOVED: "wishlist_removed",
  WISHLIST_ADDED: "wishlist_added",
  WISHLIST_UPDATED: "wishlist_updated",
  WISHLIST_ERROR: "wishlist_error",

  // Cart events
  CART_UPDATED: "cart_updated",
  CART_CLEARED: "cart_cleared",
  CART_ERROR: "cart_error",
  CART_ITEM_ADDED: "cart_item_added",
  CART_ITEM_REMOVED: "cart_item_removed",
  CART_ITEM_UPDATED: "cart_item_updated",

  // Order events
  ORDER_PLACED: "order_placed",
  ORDER_UPDATED: "order_updated",
  ORDER_CANCELLED: "order_cancelled",
  ORDER_COMPLETED: "order_completed",

  // Analytics events
  ANALYTICS_UPDATED: "analytics_updated",
  ANALYTICS_FLUSHED: "analytics_flushed",

  // Flush events
  FLUSH_REQUESTED: "flush_requested",

  INTERACTION_RECORDED: "interaction_recorded",
};

export {
  dbEventNames,
  globalEvents as evt,
  dbEvents,
  DatabaseDocumentEvent,
  GlobalEventNames as Evts,

  // Event classes
  ProductEvent,
  ErrorEvent,
  CommentEvent,
};
