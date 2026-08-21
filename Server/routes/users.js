import express from "express";
import { db } from "../utils/db.js";

const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
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
});

export default router;
