const express = require("express");
const { protect } = require("../middleware/auth");
const { askAssistant, calculateGpa } = require("../controllers/assistant.controller");

const router = express.Router();

// Keep consistent with the rest of the API (requires auth)
router.use(protect);

router.post("/ask", askAssistant);
router.post("/gpa", calculateGpa);

module.exports = router;

