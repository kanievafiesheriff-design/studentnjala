function normalizeScale(scale) {
  const s = Number(scale);
  if (s === 4 || s === 5) return s;
  return 5;
}

function scoreToLetter(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return null;
  if (n >= 70) return "A";
  if (n >= 60) return "B";
  if (n >= 50) return "C";
  if (n >= 45) return "D";
  if (n >= 40) return "E";
  return "F";
}

function gradePoint(letter, scale) {
  const g = String(letter || "").trim().toUpperCase();
  if (scale === 4) {
    // Common 4.0 mapping (no E grade)
    if (g === "A") return 4;
    if (g === "B") return 3;
    if (g === "C") return 2;
    if (g === "D") return 1;
    if (g === "F") return 0;
    return null;
  }

  // 5.0 mapping (supports E)
  if (g === "A") return 5;
  if (g === "B") return 4;
  if (g === "C") return 3;
  if (g === "D") return 2;
  if (g === "E") return 1;
  if (g === "F") return 0;
  return null;
}

function interpretGpa(gpa, scale) {
  const n = Number(gpa);
  if (!Number.isFinite(n)) return "Unknown";

  // A reasonable default interpretation for 5.0 systems
  if (scale === 5) {
    if (n >= 4.5) return "First Class";
    if (n >= 3.5) return "Second Class Upper";
    if (n >= 2.5) return "Second Class Lower";
    if (n >= 1.5) return "Third Class";
    if (n >= 1.0) return "Pass";
    return "Fail";
  }

  // 4.0 system interpretation (approximate)
  if (n >= 3.7) return "First Class / Distinction";
  if (n >= 3.3) return "Second Class Upper";
  if (n >= 2.7) return "Second Class Lower";
  if (n >= 2.0) return "Third Class";
  if (n >= 1.0) return "Pass";
  return "Fail";
}

function calculateGpaFromCourses({ courses, scale = 5 }) {
  const usedScale = normalizeScale(scale);
  const list = Array.isArray(courses) ? courses : [];

  const normalized = list.map((c, idx) => {
    const units = Number(c?.units ?? c?.unit ?? c?.credit ?? c?.credits);
    const code = c?.code || c?.courseCode || c?.name || `Course ${idx + 1}`;

    let letter = c?.grade ?? c?.letter;
    if (!letter && c?.score != null) letter = scoreToLetter(c.score);
    if (!letter && c?.mark != null) letter = scoreToLetter(c.mark);
    if (!letter && c?.percentage != null) letter = scoreToLetter(c.percentage);

    const gp = gradePoint(letter, usedScale);

    return {
      code,
      units: Number.isFinite(units) ? units : null,
      grade: letter ? String(letter).toUpperCase() : null,
      gradePoint: gp,
      qualityPoints:
        Number.isFinite(units) && Number.isFinite(gp) ? units * gp : null,
    };
  });

  const valid = normalized.filter(
    (c) =>
      Number.isFinite(c.units) &&
      c.units > 0 &&
      Number.isFinite(c.gradePoint)
  );

  const totalUnits = valid.reduce((sum, c) => sum + c.units, 0);
  const totalQualityPoints = valid.reduce((sum, c) => sum + c.qualityPoints, 0);

  const gpa = totalUnits > 0 ? totalQualityPoints / totalUnits : null;

  return {
    scale: usedScale,
    courses: normalized,
    totals: {
      totalUnits,
      totalQualityPoints,
      countedCourses: valid.length,
      providedCourses: normalized.length,
    },
    gpa,
    gpaRounded: Number.isFinite(gpa) ? Math.round(gpa * 100) / 100 : null,
    interpretation: Number.isFinite(gpa) ? interpretGpa(gpa, usedScale) : null,
  };
}

module.exports = {
  calculateGpaFromCourses,
  interpretGpa,
};

