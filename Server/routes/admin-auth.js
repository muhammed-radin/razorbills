var express = require("express");
var router = express.Router();
const CryptoJS = require("crypto-js");
const { decryptStrict } = require("../utils/crypt");
const { useMemory, getMemory } = require("../utils/memory");

var uuid = require("uuid").v4;

router.post("/", async function (req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if the username and password match the admin credentials
    if (
      decryptStrict(username) === process.env.ADMIN_USERNAME &&
      decryptStrict(password) === process.env.ADMIN_PASSWORD
    ) {
      const token = uuid();

      // Set the admin token in a cookie
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      useMemory(token, "adminToken", 24 * 60 * 60 * 1000); // Store the token in memory for 1 day

      return res.status(200).json({
        message: "Admin login successful",
        success: true,
        token,
      });
    } else {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
});

router.post("/validate", async function (req, res, next) {
  const token =
    req.cookies.adminToken || req.headers["token"] || req.body.token;

  if (!token) {
    return res.status(401).json({ message: "No admin token provided" });
  }

  // Check if the token is valid
  if (
    getMemory("adminToken")?.get() === token ||
    req.cookies.adminToken === token
  ) {
    return res.status(200).json({ message: "Admin token is valid" });
  } else {
    return res.status(401).json({ message: "Invalid admin token" });
  }
});

module.exports = router;
