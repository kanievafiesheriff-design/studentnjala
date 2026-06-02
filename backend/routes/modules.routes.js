const express = require("express");
const upload = require("../middleware/upload");
const {
  getModules,
  createModule,
  updateModule,
  deleteModule,
} = require("../controllers/modules.controller");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getModules);

router.post(
  "/",
  protect,
  authorize("admin"),
  (req, res, next) => {
    req.uploadType = "modules";
    next();
  },
  upload.single("file"),
  createModule
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  (req, res, next) => {
    req.uploadType = "modules";
    next();
  },
  upload.single("file"),
  updateModule
);

router.delete("/:id", protect, authorize("admin"), deleteModule);

module.exports = router;
