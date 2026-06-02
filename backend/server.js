require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { initSocket } = require("./socket");
const ensureAdmin = require("./utils/ensureAdmin");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const hospitalRoutes = require("./routes/hospitals.routes");
const applicationRoutes = require("./routes/applications.routes");
const announcementRoutes = require("./routes/announcements.routes");
const moduleRoutes = require("./routes/modules.routes");
const timetableRoutes = require("./routes/timetables.routes");
const leadershipRoutes = require("./routes/leadership.routes");
const chatRoutes = require("./routes/chat.routes");
const assistantRoutes = require("./routes/assistant.routes");
const idCardRoutes = require("./routes/idCard.routes");
const setupRoutes = require("./routes/setup.routes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
});

initSocket(io);
app.set("io", io);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "NUNAP API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/leadership", leadershipRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/id-card", idCardRoutes);
app.use("/api/setup", setupRoutes);

app.use(errorHandler);

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const PORT = normalizePort(process.env.PORT || "5000");

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use. Set PORT to a free port or stop the process using it.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

server.on("error", onError);

connectDB()
  .then(async () => {
    await ensureAdmin();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
      console.log(`Chat (Socket.io) enabled`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
