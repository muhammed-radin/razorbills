import mongoose from "mongoose";

// total analytics for the entire site
const siteAnalyticsSchema = mongoose.Schema(
  {
    _id: { type: String, required: true, default: "global_counters" },
    totalUsers: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },

    totalSearches: { type: Number, default: 0 },

    // products
    lowAlertProducts: { type: Number, default: 0 },
    stockOutProducts: { type: Number, default: 0 },

    // orders
    totalDeliveredOrders: { type: Number, default: 0 },
    totalReturnedOrders: { type: Number, default: 0 },
    totalCancelledOrders: { type: Number, default: 0 },

    // reviews
    totalReviews: { type: Number, default: 0 },

    traffic: {
      allViews: { type: Number, default: 0 },
      debouncedViews: { type: Number, default: 0 }, // unique guests + unique users
      uniqueGuests: { type: Number, default: 0 },
      uniqueUsers: { type: Number, default: 0 },
      platformDistribution: {
        desktop: { type: Number, default: 0 },
        mobile: { type: Number, default: 0 },
        tablet: { type: Number, default: 0 },
      },
      sources: {
        chrome: { type: Number, default: 0 },
        firefox: { type: Number, default: 0 },
        safari: { type: Number, default: 0 },
        edge: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
      },
    },

    activeUsers: {
      // last 30 days
      type: Number,
      default: 0,
    },

    engagement: {
      totalShares: { type: Number, default: 0 },
      totalComments: { type: Number, default: 0 },
      totalRatingsGiven: { type: Number, default: 0 },
    },

    lastUpdated: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

// daily analytics for the entire site
const dailyAnalyticsReferenceSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: () => new Date().toISOString().split("T")[0],
      unique: true,
    }, // YYYY-MM-DD
    date: { type: Date, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

const dailyAnalyticsSchema = siteAnalyticsSchema.clone();
dailyAnalyticsSchema.add(dailyAnalyticsReferenceSchema);

// weekly analytics for the entire site
const weeklyAnalyticsReferenceSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: () => {
        const now = new Date();
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear =
          (now - firstDayOfYear) / 86400000 + firstDayOfYear.getDay() + 1;
        const weekNumber = Math.ceil(pastDaysOfYear / 7);
        return `${now.getFullYear()}-W${weekNumber}`;
      },
      unique: true,
    }, // YYYY-WW
    weekStartDate: { type: Date, required: true, unique: true },
    weekEndDate: { type: Date, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

const weeklyAnalyticsSchema = siteAnalyticsSchema.clone();
weeklyAnalyticsSchema.add(weeklyAnalyticsReferenceSchema);

// Annual analytics for the entire site
const annualAnalyticsReferenceSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: () => new Date().getFullYear().toString(),
      unique: true,
    }, // YYYY
    year: {
      type: Number,
      required: true,
      unique: true,
      default: new Date().getFullYear(),
    },

    january: { type: Number, default: 0, min: 0, max: 100 }, // percentage of analytics for the month
    february: { type: Number, default: 0, min: 0, max: 100 },
    march: { type: Number, default: 0, min: 0, max: 100 },
    april: { type: Number, default: 0, min: 0, max: 100 },
    may: { type: Number, default: 0, min: 0, max: 100 },
    june: { type: Number, default: 0, min: 0, max: 100 },
    july: { type: Number, default: 0, min: 0, max: 100 },
    august: { type: Number, default: 0, min: 0, max: 100 },
    september: { type: Number, default: 0, min: 0, max: 100 },
    october: { type: Number, default: 0, min: 0, max: 100 },
    november: { type: Number, default: 0, min: 0, max: 100 },
    december: { type: Number, default: 0, min: 0, max: 100 },
  },
  {
    timestamps: true,
  },
);

const annualAnalyticsSchema = siteAnalyticsSchema.clone();
annualAnalyticsSchema.add(annualAnalyticsReferenceSchema);

export const SiteAnalyticsModel = mongoose.model(
  "SiteAnalytics",
  siteAnalyticsSchema,
  "site_analytics",
);

export const DailyAnalyticsModel = mongoose.model(
  "DailyAnalytics",
  dailyAnalyticsSchema,
  "daily_analytics",
);

export const WeeklyAnalyticsModel = mongoose.model(
  "WeeklyAnalytics",
  weeklyAnalyticsSchema,
  "weekly_analytics",
);

export const AnnualAnalyticsModel = mongoose.model(
  "AnnualAnalytics",
  annualAnalyticsSchema,
  "annual_analytics",
);

// schema
export default {
  siteAnalyticsSchema,
  dailyAnalyticsSchema,
  weeklyAnalyticsSchema,
  annualAnalyticsSchema,
};
