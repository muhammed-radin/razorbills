var express = require("express");
var router = express.Router();
const CryptoJS = require("crypto-js");
const { decryptStrict } = require("../utils/crypt");

router.post("/", async function (req, res, next) {
  try {
    const { username, password } = req.body;

    console.log(username, password);
    console.log(decryptStrict(username), decryptStrict(password));
    console.log("================================");

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
      return res.status(200).json({ message: "Admin login successful" });
    } else {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
