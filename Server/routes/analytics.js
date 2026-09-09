import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
} from "../utils/middlewares/reqiuredAuth.js";
import { requireAdmin, requirePermission } from "../utils/middlewares/RBAC.js";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  passUserAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ error: "User ID not found in request" });
      }

      const user = await db.collection("users").findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user.analytics || {});
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      res.status(500).json({ error: "Failed to fetch user analytics" });
    }
  },
);

export default router;
