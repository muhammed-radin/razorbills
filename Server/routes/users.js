import express from "express";
import { db } from "../utils/db.js";
import { requireAuth } from "../utils/middlewares/reqiuredAuth.js";
import { requireAdmin, requirePermission } from "../utils/middlewares/RBAC.js";

const router = express.Router();

/* GET users listing. */
router.get(
  "/",
  requirePermission("read"),
  requireAdmin,
  function (req, res, next) {
    db.collection("users")
      .find({})
      .toArray()
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
      });
  },
);

export default router;
