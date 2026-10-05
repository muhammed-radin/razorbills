import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
} from "../utils/middlewares/reqiuredAuth.js";
import { requireAdmin, requirePermission } from "../utils/middlewares/RBAC.js";
import {
  DailyAnalyticsModel,
  EventsRecordModel,
  SiteAnalyticsModel,
} from "../models/schema/analytics.js";
import { calculateAnalyticsFrom } from "../utils/calc_analytics.js";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  passUserAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res) => {
    try {
      const analytics = await SiteAnalyticsModel.findOne({
        id: "global_counters",
      });
      if (!analytics) {
        return res.status(404).json({ error: "Analytics not found" });
      }

      res.json(analytics || {});
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      res.status(500).json({ error: "Failed to fetch user analytics" });
    }
  },
);

router.get(
  "/events/",
  requireAuth,
  passUserAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res) => {
    const limit = parseInt(req.query.limit) || 100; // Default limit to 100 if not provided
    const skip = parseInt(req.query.skip) || 0; // Default skip to 0 if not provided
    const sort = req.query.sort || { happenedAt: -1 }; // Default sort by happenedAt descending
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {}; // Parse filter if provided

    let query = filter;

    try {
      const events = await EventsRecordModel.find({})
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray();
      res.json(events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  },
);

router.get(
  "/report",
  requireAuth,
  passUserAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res) => {
    const start = req.query.start ? new Date(req.query.start) : null;
    const end = req.query.end ? new Date(req.query.end) : null;

    let query = {
      $or: [
        { happenedAt: { $gte: start, $lte: end } },
        { createdAt: { $gte: start, $lte: end } },
        { updatedAt: { $gte: start, $lte: end } },
      ],
    };

    try {
      const events = await DailyAnalyticsModel.find(query);
      res.json(calculateAnalyticsFrom(events) || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  },
);

// NOTE: /:dayid must be registered AFTER static routes (/events, /report),
// otherwise "events"/"report" are captured as dayid and those routes 404.
router.get(
  "/:dayid",
  requireAuth,
  passUserAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res) => {
    try {
      const analytics = await DailyAnalyticsModel.findOne({
        _id: req.params.dayid,
      });
      if (!analytics) {
        return res.status(404).json({ error: "Analytics not found" });
      }

      res.json(analytics || {});
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      res.status(500).json({ error: "Failed to fetch user analytics" });
    }
  },
);

export default router;
