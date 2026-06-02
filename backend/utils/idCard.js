const crypto = require("crypto");

function generateIdCardCode() {
  const segment = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `NUNA-${segment}`;
}

async function ensureUniqueCode(User) {
  let code = generateIdCardCode();
  let exists = await User.findOne({ idCardCode: code });
  while (exists) {
    code = generateIdCardCode();
    exists = await User.findOne({ idCardCode: code });
  }
  return code;
}

function getVerifyBaseUrl() {
  const client = process.env.CLIENT_URL || "http://localhost:3000";
  return `${client.replace(/\/$/, "")}/verify-id`;
}

function buildVerifyUrl(code) {
  return `${getVerifyBaseUrl()}/${code}`;
}

function formatIdCard(user) {
  const code = user.idCardCode;
  return {
    code,
    status: user.idCardStatus || "active",
    issuedAt: user.idCardIssuedAt,
    verifyUrl: code ? buildVerifyUrl(code) : null,
    member: {
      name: user.name,
      matricNumber: user.matricNumber,
      email: user.email,
      level: user.level,
      department: user.department,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
    },
  };
}

module.exports = {
  generateIdCardCode,
  ensureUniqueCode,
  buildVerifyUrl,
  getVerifyBaseUrl,
  formatIdCard,
};
