const fs = require("fs");
const path = require("path");

function minimalPdf(title, subtitle) {
  const line1 = title.replace(/[()\\]/g, "");
  const line2 = (subtitle || "Njala University Nurses Association").replace(
    /[()\\]/g,
    ""
  );
  const stream = `BT /F1 16 Tf 50 750 Td (${line1}) Tj 0 -24 Td /F1 11 Tf (${line2}) Tj ET`;
  const len = Buffer.byteLength(stream, "utf8");
  return Buffer.from(
    `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length ${len}>>stream
${stream}
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
00000000058 00000 n 
0000000115 00000 n 
0000000270 00000 n 
0000000380 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
450
%%EOF`,
    "utf8"
  );
}

const root = path.join(__dirname, "..", "public");

const modules = [
  ["modules", "nursing-fundamentals.pdf", "Nursing Fundamentals"],
  ["modules", "anatomy-physiology.pdf", "Anatomy and Physiology"],
  ["modules", "pharmacology-basics.pdf", "Pharmacology Basics"],
  ["modules", "medical-surgical-nursing.pdf", "Medical-Surgical Nursing"],
  ["modules", "maternal-child-health.pdf", "Maternal and Child Health"],
  ["modules", "community-health-nursing.pdf", "Community Health Nursing"],
  ["modules", "mental-health-nursing.pdf", "Mental Health Nursing"],
  ["modules", "clinical-placement-guide.pdf", "Clinical Placement Guide"],
];

const timetables = [
  ["timetables", "year1-semester1.pdf", "Year 1 Semester 1 Timetable"],
  ["timetables", "year1-semester2.pdf", "Year 1 Semester 2 Timetable"],
  ["timetables", "year2-semester1.pdf", "Year 2 Semester 1 Timetable"],
  ["timetables", "year2-semester2.pdf", "Year 2 Semester 2 Timetable"],
  ["timetables", "year3-semester1.pdf", "Year 3 Semester 1 Timetable"],
  ["timetables", "year3-semester2.pdf", "Year 3 Semester 2 Timetable"],
  ["timetables", "clinical-posting-2026.pdf", "Clinical Posting Timetable 2026"],
  ["timetables", "examination-2026.pdf", "Examination Timetable 2026"],
];

[...modules, ...timetables].forEach(([dir, file, title]) => {
  const folder = path.join(root, dir);
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, file), minimalPdf(title));
  console.log("Created", path.join(dir, file));
});
