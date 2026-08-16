var express = require("express");
const { Category } = require("../models/schema/categories");
const { globalMemory } = require("../utils/cache-utils/global-cache");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res) {
  if (globalMemory?.getLocalMemory("categories")) {
    return res.json(globalMemory.getLocalMemory("categories"));
  }

  Category.find({})
    .then((categories) => {
      globalMemory.setLocalMemory("categories", categories, 60 * 60); // Cache for 1 hour
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

router.get("/:id", function (req, res) {
  const categoryId = req.params.id;

  Category.findOne({ id: categoryId })
    .then((category) => {
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    })
    .catch((err) => {
      console.error("Error fetching category:", err);
      res.status(500).json({ error: "Failed to fetch category" });
    });
});

router.put("/:id", function (req, res) {
  const categoryId = req.params.id;
  const { name, icon, Logo, description } = req.body;

  Category.findOneAndUpdate(
    { id: categoryId },
    { name, icon, Logo, description },
    { new: true },
  )
    .then((updatedCategory) => {
      if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(updatedCategory);
    })
    .catch((err) => {
      console.error("Error updating category:", err);
      res.status(500).json({ error: "Failed to update category" });
    });
});

router.delete("/:id", function (req, res) {
  const categoryId = req.params.id;

  Category.findOneAndDelete({ id: categoryId })
    .then((deletedCategory) => {
      if (!deletedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting category:", err);
      res.status(500).json({ error: "Failed to delete category" });
    });
});

module.exports = router;
