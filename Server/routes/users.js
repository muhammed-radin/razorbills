import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
} from "../utils/middlewares/reqiuredAuth.js";
import { requireAdmin, requirePermission } from "../utils/middlewares/RBAC.js";
import createAuth, { getAuthInstance } from "../utils/auth.js";
import { globalMemory } from "../utils/cache-utils/global-cache.js";
import settingsRouter from "./settings.js";
import { encrypt } from "../utils/crypt.js";
import { isAPIError } from "better-auth/api";

const router = express.Router();

router.use("/settings", settingsRouter);

// user profile route for users
router.get("/profile", requireAuth, passUserAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    const user = await db.collection("users").findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

router.post("/profile", requireAuth, passUserAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    const { name, avatar, phone } = req.body;

    const updateFields = {};
    if (name) updateFields.name = encrypt(name);
    if (avatar) updateFields.image = encrypt(avatar);
    if (avatar) updateFields.profilePicture = encrypt(avatar);
    if (phone) updateFields.phoneNumber = phone;

    const result = await getAuthInstance().api.updateUser({
      query: { id: userId },
      body: updateFields,
      headers: req.headers,
    });

    res.json({ message: "Profile updated successfully", user: result });
  } catch (error) {
    // FAILURE: An error was thrown

    // 1. Check if it's a Better Auth specific API error
    if (isAPIError(error)) {
      console.error(`Auth Error [${error.status}]: ${error.message}`);

      // Example: User not found / Session expired usually returns a 401 or 404 status
      return res.status(error.status).json({
        success: false,
        message: error.message, // e.g., "Unauthorized" or validation errors
        errorCode: error.code, // e.g., "USER_NOT_FOUND" or "SESSION_EXPIRED"
        error: error, // Include the full error object for debugging purposes
      });
    }

    // 2. Fallback for generic database or network crashes
    console.error("System error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      error: error.message || "Unknown error",
    });
  }
});

/* GET users listing. */
router.get(
  "/",
  requireAuth,
  requireAdmin,
  requirePermission({ user: ["list"] }),
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
    // Admin search across name / email / id (literal, no operators).
    const search = String(req.query?.search ?? req.body?.search ?? "").trim();
    query = {};
    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query = { $or: [{ name: rx }, { email: rx }, { id: rx }] };
    }

    let totalCount = await db.collection("users").countDocuments(query);

    db.collection("users")
      .find(query)
      .sort({ [sortBy]: sortOrder })
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
  requirePermission({ user: ["get"] }),
  function (req, res, next) {
    const userId = req.params.id;
    // Never expose sensitive internals (hashes, tokens, permissions).
    db.collection("users")
      .findOne({ id: userId }, { projection: { password: 0, token: 0 } })
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
  requirePermission({ user: ["get"] }),
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

/* PATCH /users/:id/status { banned: boolean, banReason? }
 * Admin-only account activate/deactivate. Never allows self-ban or
 * role changes (roles are managed elsewhere). */
router.patch(
  "/:id/status",
  requireAuth,
  requireAdmin,
  requirePermission({ user: ["ban"] }),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const { banned, banReason } = req.body ?? {};
      if (typeof banned !== "boolean") {
        return res.status(400).json({ error: "banned (boolean) is required" });
      }
      if (req.user?.id === userId) {
        return res
          .status(400)
          .json({ error: "You cannot change your own status" });
      }
      const update = banned
        ? {
            banned: true,
            banReason: String(banReason ?? "Disabled by admin").slice(0, 500),
            isActive: false,
          }
        : { banned: false, banReason: "", isActive: true };
      const result = await db
        .collection("users")
        .updateOne({ id: userId }, { $set: update });
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const user = await db
        .collection("users")
        .findOne({ id: userId }, { projection: { password: 0, token: 0 } });
      res.json({ success: true, user });
    } catch (err) {
      console.error("Error updating user status:", err);
      res.status(500).json({ error: "Failed to update user status" });
    }
  },
);

export default router;
