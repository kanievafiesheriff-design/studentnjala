const timetableFile = (name) => `/timetables/${encodeURIComponent(name)}`;

const timetableData = [
  {
    id: 1,
    title: "2026 Second Semester Timetable",
    program: "Njala University — School of Nursing & Midwifery",
    yearLevel: "All Years",
    description:
      "Official second semester lecture, lab, and clinical schedule for all nursing students.",
    fileUrl: timetableFile("2026 SECOND SEMESTER TIMETABLE-NU-SoNM-(Final).pdf"),
    fileName: "2026-Second-Semester-Timetable-NU-SoNM.pdf",
    size: "619 KB",
  },
];

export default timetableData;
