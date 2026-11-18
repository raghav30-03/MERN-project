
const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    newCategory,
    getCategories,
    getCategoryBySlug,
    deleteCategory,
    editCategory,
} = require("../controllers/authCategories");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", upload.single("image"), newCategory);
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.put("/edit/:slug", upload.single("image"), editCategory);
router.delete("/delete/:slug", deleteCategory);

module.exports = router;
