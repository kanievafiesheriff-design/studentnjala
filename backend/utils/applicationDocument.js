function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildApplicationHtml(application) {
  const student = application.student || {};
  const hospital = application.hospital || {};

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>NUNA Clinical Posting Application</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111; margin: 32px; }
    h1 { color: #1d4ed8; margin-bottom: 4px; }
    .meta { color: #555; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; vertical-align: top; }
    th { width: 32%; background: #f8fafc; }
    .status { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Njala University Nurses Association</h1>
  <p class="meta">Clinical Posting Application</p>
  <table>
    <tr><th>Student name</th><td>${escapeHtml(student.name)}</td></tr>
    <tr><th>Matric number</th><td>${escapeHtml(student.matricNumber)}</td></tr>
    <tr><th>Email</th><td>${escapeHtml(student.email)}</td></tr>
    <tr><th>Phone</th><td>${escapeHtml(student.phone)}</td></tr>
    <tr><th>Level</th><td>${escapeHtml(student.level)}</td></tr>
    <tr><th>Hospital</th><td>${escapeHtml(hospital.hospital)}</td></tr>
    <tr><th>Location</th><td>${escapeHtml(hospital.location)}</td></tr>
    <tr><th>Department</th><td>${escapeHtml(application.department)}</td></tr>
    <tr><th>Preferred start</th><td>${formatDate(application.preferredStartDate)}</td></tr>
    <tr><th>Reason</th><td>${escapeHtml(application.reason)}</td></tr>
    <tr><th>Status</th><td class="status">${escapeHtml(application.status)}</td></tr>
    <tr><th>Applied on</th><td>${formatDate(application.appliedAt || application.createdAt)}</td></tr>
    ${
      application.adminNote
        ? `<tr><th>Admin note</th><td>${escapeHtml(application.adminNote)}</td></tr>`
        : ""
    }
  </table>
</body>
</html>`;
}

function minimalPdf(title, lines = []) {
  const safeTitle = title.replace(/[()\\]/g, "");
  const safeLines = lines.map((line) => line.replace(/[()\\]/g, ""));
  let y = 750;
  let stream = `BT /F1 16 Tf 50 ${y} Td (${safeTitle}) Tj`;
  y -= 28;
  safeLines.forEach((line) => {
    stream += ` 0 -20 Td /F1 11 Tf (${line}) Tj`;
  });
  stream += " ET";
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

module.exports = {
  buildApplicationHtml,
  minimalPdf,
};
