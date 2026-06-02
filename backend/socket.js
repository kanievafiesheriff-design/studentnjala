const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");
const { formatContact } = require("./utils/chatHelpers");

const contactSelect = "name email role level department profileImage matricNumber";

function initSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Not authorized"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      socket.join(`user:${user._id}`);
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join_conversation", (conversationId) => {
      if (conversationId) {
        socket.join(`conversation:${conversationId}`);
      }
    });

    socket.on("leave_conversation", (conversationId) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
    });

    socket.on("send_message", async ({ conversationId, text }, ack) => {
      try {
        if (!conversationId || !text?.trim()) {
          if (typeof ack === "function") {
            ack({ success: false, message: "Invalid message" });
          }
          return;
        }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
          if (typeof ack === "function") {
            ack({ success: false, message: "Conversation not found" });
          }
          return;
        }

        const isParticipant = conversation.participants.some(
          (p) => p.toString() === socket.user._id.toString()
        );

        if (!isParticipant) {
          if (typeof ack === "function") {
            ack({ success: false, message: "Not allowed" });
          }
          return;
        }

        const trimmed = String(text).trim();

        const message = await Message.create({
          conversation: conversation._id,
          sender: socket.user._id,
          text: trimmed,
          readBy: [socket.user._id],
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

        io.to(`conversation:${conversationId}`).emit("new_message", payload);

        conversation.participants.forEach((participantId) => {
          const pid = participantId.toString();
          if (pid !== socket.user._id.toString()) {
            io.to(`user:${pid}`).emit("conversation_updated", {
              conversationId: conversation._id.toString(),
              lastMessage: trimmed,
              lastMessageAt: conversation.lastMessageAt,
            });
          }
        });

        if (typeof ack === "function") {
          ack({ success: true, data: payload });
        }
      } catch (err) {
        if (typeof ack === "function") {
          ack({ success: false, message: err.message });
        }
      }
    });

    socket.on("typing", ({ conversationId, isTyping }) => {
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit("user_typing", {
        conversationId,
        userId: socket.user._id.toString(),
        userName: socket.user.name,
        isTyping: Boolean(isTyping),
      });
    });
  });
}

module.exports = { initSocket };
