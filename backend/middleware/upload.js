const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadRoot = path.join(__dirname, "..", "uploads");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

["modules", "timetables", "announcements", "profiles"].forEach((folder) => {
  ensureDir(path.join(uploadRoot, folder));
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const type = req.uploadType || "modules";
    const dir = path.join(uploadRoot, type);
    ensureDir(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
