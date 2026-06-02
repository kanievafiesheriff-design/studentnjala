const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const {
  LECTURER_ROLES,
  formatContact,
  otherParticipant,
} = require("../utils/chatHelpers");

const contactSelect = "name email role level department profileImage matricNumber";

exports.getContacts = asyncHandler(async (req, res) => {
  const meId = req.user._id;

  const [classmates, lecturers] = await Promise.all([
    User.find({ role: "student", _id: { $ne: meId } })
      .select(contactSelect)
      .sort({ name: 1 })
      .limit(200),
    User.find({ role: { $in: LECTURER_ROLES }, _id: { $ne: meId } })
      .select(contactSelect)
      .sort({ name: 1 }),
  ]);

  res.json({
    success: true,
    data: {
      classmates: classmates.map(formatContact),
      lecturers: lecturers.map(formatContact),
    },
  });
});

exports.getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate("participants", contactSelect)
    .sort({ lastMessageAt: -1 });

  const data = conversations.map((conv) => {
    const other = otherParticipant(conv, req.user._id);
    const populated =
      typeof other === "object" && other.name ? other : null;
    return {
      _id: conv._id,
      lastMessage: conv.lastMessage,
      lastMessageAt: conv.lastMessageAt,
      otherUser: populated ? formatContact(populated) : { _id: other._id },
    };
  });

  res.json({ success: true, data });
});

exports.createConversation = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  if (userId === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "Cannot start a chat with yourself",
    });
  }

  const otherUser = await User.findById(userId).select(contactSelect);
  if (!otherUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, otherUser._id], $size: 2 },
  }).populate("participants", contactSelect);

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, otherUser._id],
    });
    await conversation.populate("participants", contactSelect);
  }

  res.json({
    success: true,
    data: {
      _id: conversation._id,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
      otherUser: formatContact(otherUser),
    },
  });
});

exports.getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    return res.status(403).json({
      success: false,
      message: "Not allowed in this conversation",
    });
  }

  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
  const messages = await Message.find({ conversation: conversation._id })
    .populate("sender", contactSelect)
    .sort({ createdAt: -1 })
    .limit(limit);

  await Message.updateMany(
    {
      conversation: conversation._id,
      sender: { $ne: req.user._id },
      readBy: { $ne: req.user._id },
    },
    { $addToSet: { readBy: req.user._id } }
  );

  res.json({
    success: true,
    data: messages.reverse().map((m) => ({
      _id: m._id,
      text: m.text,
      createdAt: m.createdAt,
      sender: formatContact(m.sender),
    })),
  });
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || !String(text).trim()) {
    return res.status(400).json({
      success: false,
      message: "Message text is required",
    });
  }

  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    return res.status(403).json({
      success: false,
      message: "Not allowed in this conversation",
    });
  }

  const trimmed = String(text).trim();

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text: trimmed,
    readBy: [req.user._id],
  });

  conversation.lastMessage = trimmed;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  await message.populate("sender", contactSelect);

  const payload = {
    _id: message._id,
    conversationId: conversation._id.toString(),
    text: message.text,
    createdAt: message.createdAt,
    sender: formatContact(message.sender),
  };

  res.status(201).json({ success: true, data: payload });
});
