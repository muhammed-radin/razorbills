var express = require("express");
var router = express.Router();
const CryptoJS = require("crypto-js");
const { decryptStrict } = require("../utils/crypt");
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
      return res.status(200).json({
        message: "Admin login successful",
        success: true,
        token: uuid,
      });
    } else {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
