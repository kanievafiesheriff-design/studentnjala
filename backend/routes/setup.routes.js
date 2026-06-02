const express = require("express");
const { resetAdmin } = require("../controllers/setup.controller");

const router = express.Router();

router.post("/reset-admin", resetAdmin);

module.exports = router;
