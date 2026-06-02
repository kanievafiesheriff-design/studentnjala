const LECTURER_ROLES = ["lecturer", "clinical_supervisor", "leader", "admin"];

function isLecturerRole(role) {
  return LECTURER_ROLES.includes(role);
}

function formatContact(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    level: user.level,
    department: user.department,
    profileImage: user.profileImage,
    matricNumber: user.matricNumber,
    isLecturer: isLecturerRole(user.role),
  };
}

function participantIds(conversation) {
  return conversation.participants.map((p) =>
    typeof p === "object" && p._id ? p._id.toString() : p.toString()
  );
}

function otherParticipant(conversation, userId) {
  const id = userId.toString();
  const other = conversation.participants.find((p) => {
    const pid = typeof p === "object" && p._id ? p._id.toString() : p.toString();
    return pid !== id;
  });
  return typeof other === "object" ? other : { _id: other };
}

module.exports = {
  LECTURER_ROLES,
  isLecturerRole,
  formatContact,
  participantIds,
  otherParticipant,
};
