import express from "express";
import { db } from "../utils/db.js";
import {
  evt,
  Evts,
  RecordEvent,
  ProductEvent,
  SessionEvent,
  UserEvent,
} from "../utils/events.manage.js";
import { CounterModel } from "../models/schema/counters.js";
import { getAgenda } from "../utils/agenda.js";
import {
  AnalyticEventModel,
  DailyAnalyticsModel,
  EventsRecordModel,
  SiteAnalyticsCacheModel,
  SiteAnalyticsModel,
} from "../models/schema/analytics.js";
import { UAParser } from "ua-parser-js";
import dayjs from "dayjs";
import { toast } from "sonner";
import { calculateAnalyticsFrom } from "../utils/calc_analytics.js";

const router = express.Router();

const recordsBuffer = [];
const analyticsRecordsBuffer = [];
const debugEvents = [];

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
  Evts.PRODUCT_LOW_STOCK,
  Evts.PRODUCT_OUT_OF_STOCK,

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
  [Evts.PRODUCT_LOW_STOCK]: "Product Low Stock",
  [Evts.PRODUCT_OUT_OF_STOCK]: "Product Out of Stock",
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
  [Evts.PRODUCT_LOW_STOCK]: "Product low stock",
  [Evts.PRODUCT_OUT_OF_STOCK]: "Product out of stock",
  /////
  [Evts.ORDER_COMPLETED]: "Order completed",
  [Evts.ORDER_CANCELLED]: "Order cancelled",
  [Evts.ORDER_RETURN_REQUESTED]: "Order return requested",
};

function getDeviceType(userAgentString) {
  const parser = new UAParser(userAgentString);
  const device = parser.getDevice();

  // ua-parser-js returns 'mobile' or 'tablet' for those devices
  if (device.type === "mobile" || device.type === "tablet") {
    return device.type;
  }

  // If type is undefined but browser/os is detected, it's a desktop
  const result = parser.getResult();
  if (!device.type && (result.browser.name || result.os.name)) {
    return "desktop";
  }

  // Fallback for bots, crawlers, or unrecognizable user-agent strings
  return "other";
}

function userAgentParser(event) {
  let string = event.userAgent || event.session?.userAgent || null;

  const parser = new UAParser(string);
  const result = parser.getResult();
  let screen = getDeviceType(string);

  return {
    browser: result.browser.name || null,
    browserVersion: result.browser.version || null,
    os: result.os.name || null,
    osVersion: result.os.version || null,
    device: result.device.model || null,
    deviceType: result.device.type || null,
    deviceVendor: result.device.vendor || null,
    screen,
  };
}

evt.onListen(function (eventInfo) {
  let { data: eventData, event: name, timestamp } = eventInfo;
  let event = eventData[0];
  let type = event?.type || name || "Unknown";

  if (name === Evts.EVENT_RECORDED || event instanceof RecordEvent) {
    return; // Avoid recording the record event itself to prevent infinite loops
  }

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

    const record = new RecordEvent({
      type: type,
      title: analyticsTitles[type] || type || "Unknown",
      message: message,
      isError: type === Evts.ERROR || event.isError || false || false,
      sector: event.sector,
      data,
      timestamp: timestamp || Date.now(),
      isAnalytics: analyticsRecordableTypes.includes(type) || false,
      id: event.id,
    });

    evt.fire(Evts.EVENT_RECORDED, record);

    debugEvents.push(eventInfo); // Store the event info in debugEvents for debugging purposes

    let userId =
      event.user?.id ||
      event.response?.userId ||
      event.session?.userId ||
      event.order?.id ||
      null;
    let sessionId = event.session?.id || null;
    let productId =
      event.product?.id ||
      event.response?.productId ||
      event.order?.productId ||
      null;
    let orderId = event.order?.id || null;

    // Copy of AnalyticEventModel
    if (analyticsRecordableTypes.includes(type)) {
      analyticsRecordsBuffer.push({
        type: type,
        timestamp: timestamp || Date.now(),
        userId,
        sessionId,
        eventId: event.id,
        path: event.reqPath || null,
        productId,
        orderId,
        search: event.search || null,
        order: {
          actor: event.order?.actor || null,
          actorId: event.order?.actorId || null,
          revenue: (event.order?.revenue && event.order?.revenue) || 0,
        },
        browser: userAgentParser(event).browser,
        device: userAgentParser(event).screen,
        os: userAgentParser(event).os,
        sector: event.sector || null,
        userAgent: event.session?.userAgent || null,
        metadata: {
          isAnalytics: true,
          provider: event.provider || null,
        },
      });
    }

    // Copy of EventsRecordModel
    recordsBuffer.push({
      type: type,
      timestamp: timestamp || Date.now(),

      title: analyticsTitles[type] || type || "Unknown",
      message: message,
      userId,
      sessionId,
      sector: event.sector || null,
      path: event.reqPath || null,
      eventId: event.id,
      productId,
      orderId,
      isError: type === Evts.ERROR || event.isError || false || false,
      isGuest: event.isGuest || false,
      isMajor: event.isMajor || false,
      refId: orderId || productId || userId || null,
      actor: event.order?.actor || false,
      actorId: event.order?.actorId || null,
      metadata: {
        isAnalytics: true,
        provider: event.provider || null,
      },
      error: event.error || null,
      errorCode: event.errorCode || null,
    });
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

evt.on(Evts.USER_DELETED, async function (evtData) {
  // first check on our collection "users"
  await db.collection("users").findOneAndUpdate(
    { id: evtData.userId },
    {
      $set: {
        isActive: false,
      },
    },
  );

  // then check on our collection "sessions"
  await db.collection("sessions").findOneAndDelete({ userId: evtData.userId });
});

router.get("/", async (req, res) => {
  res.json({ recordsBuffer, analyticsRecordsBuffer, debugEvents });
});

getAgenda().then(({ agenda, startAssiginTasks }) => {
  startAssiginTasks(() => {
    agenda.define("flush-records", async (job, done) => {
      const { recordsBuffer, analyticsRecordsBuffer } = job.attrs.data;

      if (recordsBuffer.length > 0) {
        try {
          await EventsRecordModel.insertMany(recordsBuffer);
          recordsBuffer.length = 0; // Clear the buffer after successful insertion
        } catch (error) {
          console.error("Error inserting records:", error);
          throw error; // Rethrow the error to ensure the job fails and can be retried
        }
      }

      if (analyticsRecordsBuffer.length > 0) {
        try {
          await AnalyticEventModel.insertMany(analyticsRecordsBuffer);
          analyticsRecordsBuffer.length = 0; // Clear the buffer after successful insertion
        } catch (error) {
          console.error("Error inserting analytics records:", error);
          throw error; // Rethrow the error to ensure the job fails and can be retried
        }
      }

      done(); // Mark the job as done after successful execution
    });

    agenda.define(
      "calculate-today-analytics-flush-records",
      async (job, done) => {
        const { analyticsRecordsBuffer, recordsBuffer } = job.attrs.data;

        // get today events.
        // caluclate data of the day by time range ( timestamp )
        // 1. Get today's start timestamp (12:00 AM / 00:00:00)
        const startOfToday = dayjs().startOf("day");
        const startTimestampMs = startOfToday.valueOf(); // Milliseconds (13 digits)

        // 2. Get today's end timestamp (11:59:59 PM)
        const endOfToday = dayjs().endOf("day");
        const endTimestampMs = endOfToday.valueOf(); // Milliseconds (13 digits)

        // 3. Get all events between start and end timestamps
        const events = await AnalyticEventModel.find({
          timestamp: { $gte: startTimestampMs, $lte: endTimestampMs },
        });

        let todayEvents = events.concat(analyticsRecordsBuffer); // Include buffered events for today

        // 4. Calculate analytics data based on events
        const userIDs = new Set();

        const permanentUserIDs = new Set(
          todayEvents
            .filter((event) => event.isGuest === false)
            .map((event) => event.userId),
        );
        const guestUserIDs = new Set(
          todayEvents
            .filter((event) => event.isGuest === true)
            .map((event) => event.userId),
        );

        const calculatedData = {
          totalEvents: todayEvents.length,
          uniqueViews: todayEvents.filter((event) => {
            if (event.userId) userIDs.add(event.userId);
            return (
              event.type === Evts.SITE_VIEWED &&
              event.userId &&
              userIDs.has(event.userId) == false
            );
          }).length,
          uniqueUsers: permanentUserIDs.size,
          uniqueGuests: guestUserIDs.size,
        };

        // TODO: Optimize the calculations.

        // 5. Update the DailyAnalyticsModel with the calculated data
        const analyticsRecordOFDay = await DailyAnalyticsModel.findOneAndUpdate(
          {
            _id: dayjs().format("YYYY-MM-DD"),
          },
          [
            {
              $set: {
                date: dayjs().startOf("day").toDate(),
                _id: dayjs().format("YYYY-MM-DD"),

                // Events
                "events.total": todayEvents.length,
                "events.errors": todayEvents.filter((event) => event.isError)
                  .length,
                "events.sessions": todayEvents.filter(
                  (event) => event.type === Evts.USER_LOGGED_IN,
                ).length,

                // Traffic
                "traffic.allViews": todayEvents.filter(
                  (event) => event.type === Evts.SITE_VIEWED,
                ).length,
                "traffic.debouncedViews": calculatedData.uniqueViews,
                "traffic.uniqueUsers": calculatedData.uniqueUsers,
                "traffic.uniqueGuests": calculatedData.uniqueGuests,
                "traffic.devices.desktop": todayEvents.filter(
                  (event) => userAgentParser(event).screen === "desktop",
                ).length,
                "traffic.devices.mobile": todayEvents.filter(
                  (event) => userAgentParser(event).screen === "mobile",
                ).length,
                "traffic.devices.tablet": todayEvents.filter(
                  (event) => userAgentParser(event).screen === "tablet",
                ).length,
                "traffic.devices.other": todayEvents.filter(
                  (event) => userAgentParser(event).screen === "other",
                ).length,
                "traffic.soruces.chrome": todayEvents.filter(
                  (event) => userAgentParser(event).browser === "Chrome",
                ).length,
                "traffic.soruces.firefox": todayEvents.filter(
                  (event) => userAgentParser(event).browser === "Firefox",
                ).length,
                "traffic.soruces.safari": todayEvents.filter(
                  (event) => userAgentParser(event).browser === "Safari",
                ).length,
                "traffic.soruces.edge": todayEvents.filter(
                  (event) => userAgentParser(event).browser === "Edge",
                ).length,
                "traffic.soruces.other": todayEvents.filter(
                  (event) =>
                    !["Chrome", "Firefox", "Safari", "Edge"].includes(
                      userAgentParser(event).browser,
                    ),
                ).length,

                createdAt: new Date(),
                updatedAt: new Date(),

                // Users
                "users.loggedInUsers": todayEvents.filter(
                  (event) => event.type === Evts.USER_LOGGED_IN,
                ).length,
                "users.signedUpUsers": todayEvents.filter(
                  (event) => event.type === Evts.USER_SIGNED_UP,
                ).length,

                "users.deletedUsers": todayEvents.filter(
                  (event) => event.type === Evts.USER_DELETED,
                ).length,
                "users.passwordChanged": todayEvents.filter(
                  (event) => event.type === Evts.USER_PASSWORD_CHANGED,
                ).length,

                // Products
                "products.viewed": todayEvents.filter(
                  (event) => event.type === Evts.PRODUCT_VIEWED,
                ).length,
                "products.searched": todayEvents.filter(
                  (event) => event.type === Evts.PRODUCT_SEARCHED,
                ).length,
                "products.lowStock": todayEvents.filter(
                  (event) => event.type === Evts.PRODUCT_LOW_STOCK,
                ).length,
                "products.outOfStock": todayEvents.filter(
                  (event) => event.type === Evts.PRODUCT_OUT_OF_STOCK,
                ).length,
                "products.totalProducts":
                  todayEvents.filter(
                    (event) => event.type === Evts.PRODUCT_CREATED,
                  ).length -
                  todayEvents.filter(
                    (event) => event.type === Evts.PRODUCT_DELETED,
                  ).length,

                // Engagement
                "engagement.ratings": todayEvents.filter(
                  (event) => event.type === Evts.PRODUCT_RATED,
                ).length,
                "engagement.shares": todayEvents.filter(
                  (event) => event.type === Evts.PRODUCT_SHARED,
                ).length,
                "engagement.wishlists": todayEvents.filter(
                  (event) => event.type === Evts.PRODUCT_WISHLISTED,
                ).length,
                "engagement.comments": todayEvents.filter(
                  (event) => event.type === Evts.PRODUCT_COMMENTED,
                ).length,

                // order
                // TODO: update order events also then update it again
                "orders.total": todayEvents.filter(
                  (event) => event.type === Evts.ORDER_PLACED,
                ).length,
                "orders.revenue": todayEvents.reduce((acc, event) => {
                  if (event.type === Evts.ORDER_PLACED) {
                    return acc + (event.order?.revenue || 0);
                  }
                  return acc;
                }, 0),
                "orders.cancelled": todayEvents.filter(
                  (event) => event.type === Evts.ORDER_CANCELLED,
                ).length,
                "orders.delivered": todayEvents.filter(
                  (event) => event.type === Evts.ORDER_COMPLETED,
                ).length,
                "orders.returned": todayEvents.filter(
                  (event) => event.type === Evts.ORDER_RETURN_REQUESTED,
                ).length,

                // Reviews
                "reviews.total": todayEvents.filter(
                  (event) => event.type === Evts.PRODUCT_COMMENTED,
                ).length,
              },
            },
          ],
          {
            insert: true,
            returnDocument: "after",
          },
        );

        agenda.now("flush-records", { recordsBuffer, analyticsRecordsBuffer }); // Flush records after calculating today's analytics

        done(); // Mark the job as done after successful execution
      },
    );

    agenda.define("calculate-analytics-site", async (job, done) => {
      const allDaysAnalytics = await DailyAnalyticsModel.find({});

      const calculatedData = calculateAnalyticsFrom(allDaysAnalytics);
      const last30daysAnalytics = allDaysAnalytics.filter((dayAnalytics) => {
        const dayDate = dayjs(dayAnalytics.date);
        const thirtyDaysAgo = dayjs().subtract(30, "day");
        return dayDate.isAfter(thirtyDaysAgo);
      });

      let lastActiveUsers = 0;

      if (last30daysAnalytics.length > 0) {
        const calculatedLast30DaysData =
          calculateAnalyticsFrom(last30daysAnalytics);
        if (calculatedLast30DaysData.users) {
          lastActiveUsers = calculatedLast30DaysData.users.loggedInUsers || 0;
        }
      }

      await SiteAnalyticsModel.updateOne(
        { _id: "global_counters" },
        {
          ...calculatedData,
          createdAt: new Date(),
          updatedAt: new Date(),
          activeUsers: lastActiveUsers,
        },
        { upsert: true, returnDocument: "after" },
      );

      done(); // Mark the job as done after successful execution
    });

    agenda.every("1 minute", "flush-records", {
      recordsBuffer,
      analyticsRecordsBuffer,
    });

    agenda.every("6 hours", "calculate-today-analytics-flush-records", {
      recordsBuffer,
      analyticsRecordsBuffer,
    });

    agenda.every("1 month", "calculate-analytics-site");
  });
});

export default router;
