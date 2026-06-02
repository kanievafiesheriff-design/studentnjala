const express = require("express");
const {
  getContacts,
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
} = require("../controllers/chat.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/contacts", getContacts);
router.get("/conversations", getConversations);
router.post("/conversations", createConversation);
router.get("/conversations/:id/messages", getMessages);
router.post("/conversations/:id/messages", sendMessage);

module.exports = router;
