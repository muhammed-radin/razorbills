var express = require("express");
var router = express.Router();
const CryptoJS = require("crypto-js");
const { UserModel } = require("../models/schema/user");
const { decrypt } = require("../utils/crypt");

router.post("/signup", async function (req, res, next) {
  try {
    const { email, password, avatar, name, id, provider } = req.body;

    console.log(email);

    // Use async/await instead of callbacks
    const existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password already encrypted for simplicity
    const encryptedPassword = password;
    const newUser = new UserModel({
      id: id || new Date().getTime().toString(),
      email: email,
      password: encryptedPassword,
      name: req.body.name || "User" + new Date().getTime(),
      profilePicture: avatar || null,
      provider: provider || "local",
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const { email, password } = req.body;

    // Use async/await instead of callbacks
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Password already encrypted for simplicity
    // Decrypt and compare
    const encryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_STRICT
    ).toString(CryptoJS.enc.Utf8);

    // Decrypt user input password for comparison
    const inputDecryptedPassword = CryptoJS.AES.decrypt(
      password,
      process.env.CRYPTO_STRICT
    ).toString(CryptoJS.enc.Utf8);

    if (encryptedPassword === inputDecryptedPassword) {
      await UserModel.updateOne(
        { email: email },
        { lastLogin: new Date(), currentlyLoggedIn: true }
      );
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
