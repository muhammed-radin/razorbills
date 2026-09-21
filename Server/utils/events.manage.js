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

// Major Events

class ProductEvent extends ClassicEvent {
  constructor({
    type,
    product,
    response = null,
    isReq = false,
    reqPath = null,
  }) {
    super(type, true, "product");
    this.global = true;
    this.product = product;
    this.response = response;
    this.isReq = isReq;
    this.reqPath = reqPath;
  }
}

class UserEvent extends ClassicEvent {
  constructor({ type, user, isGuest = false }) {
    super(type, true, "user");
    this.global = true;
    this.user = user;
    this.isGuest = isGuest;
  }
}

class OrderEvent extends ClassicEvent {
  constructor({ type, order }) {
    super(type, true, "order");
    this.global = true;
    this.order = order;
  }
}

class RecordEvent extends ClassicEvent {
  constructor({
    type,
    title,
    message,
    data,
    isError = false,
    sector = null,
    isAnalytic = false,
    id = null,
  }) {
    super(type, true, sector);
    this.global = true;
    this.title = title;
    this.message = message;
    this.data = data;
    this.isError = isError;
    this.happenedAt = new Date();
    this.isAnalytics = isAnalytic || false;
    if (id) {
      this.id = id;
    }
  }
}

class SessionEvent extends ClassicEvent {
  constructor({ type, session }) {
    super(type, true, "session");
    this.global = true;
    this.session = session;
    this.happenedAt = new Date();
  }
}

// Non Major Event
class CommentEvent extends ClassicEvent {
  constructor({ type, comment }) {
    super(type, false, "comment");
    this.global = true;
    this.comment = comment;
  }
}

class ErrorEvent extends ClassicEvent {
  constructor({ type, error, errorCode = null, data = null }) {
    super(type);
    this.global = true;
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
  ///////////////////// MAIN EVENTS //////////////////////////////
  // Site Events
  SITE_VIEWED: "site_viewed",

  // Error events
  ERROR: "error",

  // Product events
  PRODUCT_CREATED: "product_created",
  PRODUCT_UPDATED: "product_updated",
  PRODUCT_DELETED: "product_deleted",

  // Product interaction events
  PRODUCT_SEARCHED: "site_searched",
  PRODUCT_VIEWED: "product_viewed",
  PRODUCT_RATED: "product_rated",
  PRODUCT_SHARED: "product_shared",
  PRODUCT_WISHLISTED: "product_wishlisted",
  PRODUCT_CARTED: "product_carted",
  PRODUCT_COMMENTED: "product_commented",
  PRODUCT_LOW_STOCK: "product_low_stock",
  PRODUCT_OUT_OF_STOCK: "product_out_of_stock",
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

  // Order events
  ORDER_PLACED: "order_placed",
  ORDER_UPDATED: "order_updated",
  ORDER_CANCELLED: "order_cancelled",
  ORDER_COMPLETED: "order_completed",
  ORDER_RETURN_REQUESTED: "order_return_requested",

  // Analytics events
  ANALYTICS_UPDATED: "analytics_updated",
  ANALYTICS_FLUSHED: "analytics_flushed",

  // Log events
  EVENT_RECORDED: "event_recorded",

  ////////////////////// INDIVIDUAL EVENTS //////////////////////////////
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

  // Non Major: User events
  USER_LOGGED_OUT_REQUEST: "user_logged_out_request",

  // Non Major: Product events
  PRODUCT_SEARCHED_FROM_CACHE: "site_searched_from_cache",
  PRODUCT_STOCK_UPDATED: "product_stock_updated",
  PRODUCT_PRICE_UPDATED: "product_price_updated",
  PRODUCT_IMAGE_UPDATED: "product_image_updated",
  PRODUCT_DESCRIPTION_UPDATED: "product_description_updated",
  PRODUCT_CATEGORY_UPDATED: "product_category_updated",
  PRODUCT_TAGS_UPDATED: "product_tags_updated",
  PRODUCT_DISCOUNT_UPDATED: "product_discount_updated",

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
  UserEvent,
  OrderEvent,
  RecordEvent,
  SessionEvent,
};
