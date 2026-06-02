const fs = require("fs");
const path = require("path");
const { minimalPdf } = require("../utils/applicationDocument");

const outDir = path.join(__dirname, "..", "public", "forms");
fs.mkdirSync(outDir, { recursive: true });

const pdf = minimalPdf("Clinical Posting Application Form", [
  "Njala University Nurses Association",
  "Fill online at the student portal, then submit.",
  "Fields: hospital, department, start date, reason.",
]);

const outPath = path.join(outDir, "clinical-posting-application.pdf");
fs.writeFileSync(outPath, pdf);
console.log("Created", outPath);
