const express = require("express");
const {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/users.controller");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;
