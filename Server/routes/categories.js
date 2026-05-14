var express = require("express");
const { Category } = require("../models/schema/categories");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res) {
  Category.find({})
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      console.error("Error fetching categories:", err);
      res.status(500).json({ error: "Failed to fetch categories" });
    });
});

router.post("/", function (req, res) {
  const { id, name, icon, Logo, description } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: "ID and name are required" });
  }

  const newCategory = new Category({
    id,
    name,
    icon: icon || "",
    Logo: Logo || "",
    description: description || "",
  });

  newCategory
    .save()
    .then((category) => {
      res.status(201).json(category);
    })
    .catch((err) => {
      console.error("Error creating category:", err);
      res.status(500).json({ error: "Failed to create category" });
    });
});

module.exports = router;
