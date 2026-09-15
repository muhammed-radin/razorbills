import express from "express";
import { db } from "../utils/db.js";
import {
  evt,
  Evts,
  LogEvent,
  ProductEvent,
  SessionEvent,
  UserEvent,
} from "../utils/events.manage.js";
import { CounterModel } from "../models/schema/counters.js";

const router = express.Router();

const recordsBuffer = [];
const analyticsRecordsBuffer = [];
const analyticsRecordableTypes = [
  // common
  Evts.ERROR,
  Evts.SITE_VIEWED,
  // user based
  Evts.USER_LOGGED_IN,
  Evts.USER_LOGGED_OUT,
  Evts.USER_REGISTERED,
  Evts.USER_DELETED,
  Evts.USER_PASSWORD_CHANGED,
  // product based
  Evts.PRODUCT_SEARCHED,
  Evts.PRODUCT_VIEWED,
  Evts.PRODUCT_RATED,
  Evts.PRODUCT_SHARED,
  Evts.PRODUCT_WISHLISTED,
  Evts.PRODUCT_CARTED,
  Evts.PRODUCT_COMMENTED,

  // Order based
  Evts.ORDER_COMPLETED,
  Evts.ORDER_CANCELLED,
  Evts.ORDER_RETURN_REQUESTED,
];

const analyticsTitles = {
  /////
  [Evts.ERROR]: "Error",
  [Evts.SITE_VIEWED]: "Site Viewed",
  /////
  [Evts.USER_LOGGED_IN]: "User Logged In",
  [Evts.USER_LOGGED_OUT]: "User Logged Out",
  [Evts.USER_REGISTERED]: "User Registered",
  [Evts.USER_DELETED]: "User Deleted",
  [Evts.USER_PASSWORD_CHANGED]: "User Password Changed",
  /////
  [Evts.PRODUCT_SEARCHED]: "Product Searched",
  [Evts.PRODUCT_VIEWED]: "Product Viewed",
  [Evts.PRODUCT_RATED]: "Product Rated",
  [Evts.PRODUCT_SHARED]: "Product Shared",
  [Evts.PRODUCT_WISHLISTED]: "Product Wishlisted",
  [Evts.PRODUCT_CARTED]: "Product Carted",
  [Evts.PRODUCT_COMMENTED]: "Product Commented",
  /////
  [Evts.ORDER_COMPLETED]: "Order Completed",
  [Evts.ORDER_CANCELLED]: "Order Cancelled",
  [Evts.ORDER_RETURN_REQUESTED]: "Order Return Requested",
};

const analyticsMessages = {
  /////
  [Evts.ERROR]: "An error occurred",
  [Evts.SITE_VIEWED]: "Site viewed",
  /////
  [Evts.USER_LOGGED_IN]: "User logged in",
  [Evts.USER_LOGGED_OUT]: "User logged out",
  [Evts.USER_REGISTERED]: "User registered",
  [Evts.USER_DELETED]: "User deleted",
  [Evts.USER_PASSWORD_CHANGED]: "User password changed",
  /////
  [Evts.PRODUCT_SEARCHED]: (search) =>
    `Product searched: "${search}" at ${new Date().toISOString()}`,
  [Evts.PRODUCT_VIEWED]: "Product viewed",
  [Evts.PRODUCT_RATED]: "Product rated",
  [Evts.PRODUCT_SHARED]: "Product shared",
  [Evts.PRODUCT_WISHLISTED]: "Product wishlisted",
  [Evts.PRODUCT_CARTED]: "Product carted",
  [Evts.PRODUCT_COMMENTED]: "Product commented",
  /////
  [Evts.ORDER_COMPLETED]: "Order completed",
  [Evts.ORDER_CANCELLED]: "Order cancelled",
  [Evts.ORDER_RETURN_REQUESTED]: "Order return requested",
};

evt.onListen(function (evt) {
  let { data: eventData, event: name, timestamp } = evt;
  let event = eventData[0];
  let type = event?.type || name || "Unknown";

  console.log("----> type", type);

  // push analytics record
  if (event.isMajor == true) {
    let data = {};
    let message = analyticsMessages[type] || "Unknown";

    if (event instanceof UserEvent) {
      data = {
        userId: event.user?.id || null,
        name: event.user?.name || null,
        email: event.user?.email || null,
        isGuest: event.isGuest || event.user?.isAnonymous || false,
      };
    } else if (event instanceof SessionEvent) {
      data = {
        sessionId: event.session?.id || null,
        isGuest: event.session?.isAnonymous || false,
      };
    } else if (
      event instanceof ProductEvent &&
      type === Evts.PRODUCT_SEARCHED
    ) {
      data = {
        search: event.response?.search || null,
        fromCache: event.response?.fromCache || false,
        isReq: event.isReq || false,
      };
      message = analyticsMessages[type](data.search) || "Unknown";
    } else if (event instanceof ProductEvent) {
      data = {
        productId: event.product?.id || null,
        name: event.product?.name || null,
        category: event.product?.category || null,
        sku: event.product?.sku || null,
      };
    }

    const record = new LogEvent({
      type: type,
      title: analyticsTitles[type] || type || "Unknown",
      message: message,
      isError: type === Evts.ERROR || event.isError || false || false,
      sector: event.sector,
      data,
      timestamp: timestamp || Date.now(),
    });

    recordsBuffer.push(record);
    if (analyticsRecordableTypes.includes(type)) {
      delete record[data];
      delete record["message"];
      analyticsRecordsBuffer.push(record);
    }
  }
});

evt.on(Evts.SITE_VIEWED, function (evtData) {
  const userId = evtData.userId;
  CounterModel.findOneAndUpdate(
    {
      refId: userId,
      userId: userId,
      type: Evts.SITE_VIEWED,
    },
    { $set: { active: true } },
    { upsert: true, returnDocument: "after" },
  );
});

router.get("/", async (req, res) => {
  res.json({ recordsBuffer, analyticsRecordsBuffer });
});

export default router;
