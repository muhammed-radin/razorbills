import express from "express";
import { db } from "../utils/db.js";
import {
  passUserAuth,
  requireAuth,
} from "../utils/middlewares/reqiuredAuth.js";
import { evt, Evts, ErrorEvent, CommentEvent } from "../utils/events.manage.js";

const router = express.Router();

// get addressBook
router.get("/", requireAuth, passUserAuth, (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  db.collection("users")
    .findOne({ userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.addressBook = user.addressBook.map((address) => {
        if (address && address._id == user.address?._id) {
          address.isDefault = true;
        } else {
          address.isDefault = false;
        }
        return address;
      });
      res.json(user.addressBook || []);
    })
    .catch((err) => {
      console.error("Error fetching address book:", err);
      res.status(500).json({ error: "Failed to fetch address book" });
    });
});

// get current address
router.get("/current", requireAuth, passUserAuth, (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  db.collection("users")
    .findOne({ userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!user.address) {
        return res.status(404).json({ error: "Current address not set" });
      }
      user.address.isDefault = true;
      res.json(user.address || []);
    })
    .catch((err) => {
      console.error("Error fetching current address:", err);
      res.status(500).json({ error: "Failed to fetch current address" });
    });
});

// add new address
router.post("/", requireAuth, passUserAuth, (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  const { address } = req.body;
  db.collection("users")
    .findOneAndUpdate(
      { userId },
      { $push: { addressBook: address } },
      { upsert: true, returnDocument: "after" },
    )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        message: "Address added successfully",
        address: user.address,
        addressBook: user.addressBook,
        userId: user.userId,
      });
    })
    .catch((err) => {
      console.error("Error adding address:", err);
      res.status(500).json({ error: "Failed to add address" });
    });
});

// set current address
router.put("/", requireAuth, passUserAuth, (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  const { address } = req.body;
  const addressId = address?.id || address?._id;

  if (!addressId) {
    return res.status(400).json({ error: "Address ID is required" });
  }

  db.collection("users")
    .findOneAndUpdate(
      { userId },
      { $set: { address } },
      { upsert: true, returnDocument: "after" },
    )
    .then((user) => {
      user.addressBook = user.addressBook || [];
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({
        message: "Current address set successfully",
        address: user.address,
        userId: user.userId,
      });
    })
    .catch((err) => {
      console.error("Error setting current address:", err);
      res.status(500).json({ error: "Failed to set current address" });
    });
});

export default router;
