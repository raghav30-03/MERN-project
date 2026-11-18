
const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
    newService,
    getServices,
    getServiceBySlug,
    deleteService,
    editService,
} = require("../controllers/authServices");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", upload.single("image"), newService);
router.get("/", getServices);
router.get("/:slug", getServiceBySlug);
router.put("/edit/:slug", upload.single("image"), editService);
router.delete("/delete/:slug", deleteService);

module.exports = router;
