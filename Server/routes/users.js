import express from "express";
import { db } from "../utils/db.js";
import { requireAuth } from "../utils/middlewares/reqiuredAuth.js";
import { requireAdmin, requirePermission } from "../utils/middlewares/RBAC.js";
import createAuth, { getAuthInstance } from "../utils/auth.js";
import { globalMemory } from "../utils/cache-utils/global-cache.js";
import settingsRouter from "./settings.js";

const router = express.Router();

/* GET users listing. */
router.get(
  "/",
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  async function (req, res) {
    if (
      globalMemory?.getLocalMemory(req.url) &&
      req.query?.realtime !== "true"
    ) {
      return res.json(globalMemory.getLocalMemory(req.url));
    }
    let query = {};
    let result = {};
    let page = parseInt(req.query?.page) || parseInt(req.body?.page) || 1;
    let limit = parseInt(req.query?.limit) || parseInt(req.body?.limit) || 10;
    let sortBy = req.query?.sortBy || req.body?.sortBy || "createdAt";
    let sortOrder = req.query?.sortOrder === "asc" ? 1 : -1;
    let startIndex =
      parseInt(req.query?.startIndex) || parseInt(req.body?.startIndex) || 0;

    if (page > 1) {
      startIndex = (page - 1) * limit;
    }

    // build query based on request parameters
    query = {
      // null query for now, can be extended later
    };

    let totalCount = await db.collection("users").countDocuments(query);

    db.collection("users")
      .find(query)
      .skip(startIndex)
      .limit(limit)
      .toArray()
      .then((users) => {
        result = {
          users: users,
          page: page,
          limit: limit,
          count: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          next: page < Math.ceil(totalCount / limit) ? page + 1 : null,
          previous: page > 1 ? page - 1 : null,
          startIndex: startIndex,
          endIndex: startIndex + users.length - 1,
          sort: {
            by: sortBy,
            order: sortOrder,
          },
          fromCache: false,
        };

        globalMemory?.setLocalMemory(
          req.url,
          { ...result, fromCache: true },
          60 * 2,
        ); // Cache for 2 minutes
        res.json(result);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
      });
  },
);

router.get(
  "/:id",
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  function (req, res, next) {
    const userId = req.params.id;
    db.collection("users")
      .findOne({ id: userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Failed to fetch user" });
      });
  },
);

router.get(
  "/auth/:id/",
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  (req, res) => {
    const userId = req.params.id;

    getAuthInstance()
      .api.getUser({
        query: {
          id: userId,
        },
        headers: req.headers,
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error("Error fetching user from auth:", err);
        res.status(500).json({ error: "Failed to fetch user from auth" });
      });
  },
);

router.use("/settings", settingsRouter);

export default router;
