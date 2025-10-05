const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const keyMiddileWare = require("./utils/key");
const products = require("./sample-data");
require("dotenv").config();

app.use(cors());
app.use(express.json());
// app.use(keyMiddileWare());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/products", (req, res) => {
  
  res.json(products);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
