require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const ClinicalLocation = require("../models/ClinicalLocation");
const Announcement = require("../models/Announcement");
const Leadership = require("../models/Leadership");

const hospitals = [
  {
    hospital: "Connaught Hospital",
    location: "Freetown",
    department: "Medical Ward",
    level: "Year 1",
    status: "Active",
    supervisor: "Dr. I. Mark Kapuwa",
    description: "Basic nursing exposure, patient observation, and vital signs monitoring.",
    image: "/hospitals/connaught-1.png",
    images: ["/hospitals/connaught-1.png"],
    capacity: 25,
    slotsAvailable: 25,
  },
  {
    hospital: "Princess Christian Maternity Hospital (PCMH)",
    location: "Freetown",
    department: "Maternity Ward",
    level: "Year 2",
    status: "Active",
    supervisor: "Nurse A. Sesay",
    description: "Maternal and child health, antenatal and postnatal nursing practice.",
    image: "/hospitals/kenema-1.png",
    capacity: 20,
    slotsAvailable: 20,
  },
  {
    hospital: "Rokupa Government Hospital",
    location: "Freetown",
    department: "Surgical Ward",
    level: "Year 3",
    status: "Active",
    supervisor: "Dr. J. Kamara",
    description: "Surgical nursing care and ward management.",
    capacity: 18,
    slotsAvailable: 18,
  },
  {
    hospital: "Ola During Children's Hospital",
    location: "Freetown",
    department: "Paediatrics",
    level: "Year 2",
    status: "Active",
    supervisor: "Nurse M. Conteh",
    description: "Paediatric nursing and child health services.",
    capacity: 15,
    slotsAvailable: 15,
  },
  {
    hospital: "Bo Government Hospital",
    location: "Bo",
    department: "General Ward",
    level: "Year 2",
    status: "Active",
    supervisor: "Dr. S. Koroma",
    description: "General medical-surgical nursing in Southern Province.",
    capacity: 22,
    slotsAvailable: 22,
  },
  {
    hospital: "Njala University Hospital",
    location: "Njala",
    department: "Community Health",
    level: "All Years",
    status: "Active",
    supervisor: "Nurse P. Bangura",
    description: "University teaching hospital and community outreach.",
    capacity: 30,
    slotsAvailable: 30,
  },
  {
    hospital: "Kenema Government Hospital",
    location: "Kenema",
    department: "Emergency",
    level: "Year 3",
    status: "Active",
    supervisor: "Dr. A. Jalloh",
    description: "Emergency and trauma nursing in Eastern Province.",
    capacity: 20,
    slotsAvailable: 20,
  },
  {
    hospital: "Kono Government Hospital",
    location: "Kono",
    department: "Medical Ward",
    level: "Year 3",
    status: "Upcoming",
    supervisor: "Nurse F. Sesay",
    description: "Rural hospital posting in Kono District.",
    capacity: 12,
    slotsAvailable: 12,
  },
];

const announcements = [
  {
    title: "2026 Second Semester Timetable Released",
    content:
      "The official second semester timetable is now available. Download it from the Modules page under Timetables.",
    category: "Academic",
    author: "Faculty Office",
    pinned: true,
    urgent: false,
  },
  {
    title: "Clinical Posting Applications Open",
    content:
      "Applications for hospital clinical postings are open for Year 2 and Year 3 students. Apply through the portal before the deadline.",
    category: "Clinical",
    author: "Clinical Coordinator",
    pinned: true,
    urgent: true,
  },
  {
    title: "Public Lecture on ENT",
    content:
      "All students are invited to review ENT module materials following the recent public lecture on Ear, Nose and Throat nursing care.",
    category: "Events",
    author: "School of Nursing & Midwifery",
    pinned: false,
    urgent: false,
  },
];

const leaders = [
  {
    name: "Student President",
    position: "President",
    contact: "+232 76 000 001",
    bio: "Leads the Nurses Association executive and represents students to faculty.",
    order: 1,
  },
  {
    name: "Student Vice President",
    position: "Vice President",
    contact: "+232 76 000 002",
    bio: "Supports the president and oversees internal association affairs.",
    order: 2,
  },
  {
    name: "Secretary General",
    position: "Secretary General",
    contact: "+232 76 000 003",
    bio: "Manages records, minutes, and official correspondence.",
    order: 3,
  },
  {
    name: "Treasurer",
    position: "Treasurer",
    contact: "+232 76 000 004",
    bio: "Oversees association finances and welfare fund.",
    order: 4,
  },
  {
    name: "Public Relations Officer",
    position: "Public Relations Officer",
    contact: "+232 76 000 005",
    bio: "Handles publicity, events, and external communications.",
    order: 5,
  },
  {
    name: "Welfare Officer",
    position: "Welfare Officer",
    contact: "+232 76 000 006",
    bio: "Supports student welfare and wellbeing initiatives.",
    order: 6,
  },
];

async function seed() {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    ClinicalLocation.deleteMany({}),
    Announcement.deleteMany({}),
    Leadership.deleteMany({}),
  ]);

  console.log("Creating admin user...");
  await User.create({
    name: "System Administrator",
    email: process.env.ADMIN_EMAIL || "admin@nuna.edu.sl",
    password: process.env.ADMIN_PASSWORD || "NUNA@Admin2026",
    role: "admin",
    matricNumber: "ADMIN001",
    department: "Administration",
  });

  console.log("Creating demo student...");
  await User.create({
    name: "Demo Student",
    email: "student@nuna.edu.sl",
    password: "Student@2026",
    role: "student",
    matricNumber: "NUNAP2024001",
    level: "Year 2",
    phone: "+232 76 111 111",
    department: "BSc Nursing",
  });

  console.log("Creating demo classmates...");
  await User.insertMany([
    {
      name: "Aminata Koroma",
      email: "aminata@nuna.edu.sl",
      password: "Student@2026",
      role: "student",
      matricNumber: "NUNAP2024002",
      level: "Year 2",
      department: "BSc Nursing",
    },
    {
      name: "Mohamed Bangura",
      email: "mohamed@nuna.edu.sl",
      password: "Student@2026",
      role: "student",
      matricNumber: "NUNAP2024003",
      level: "Year 2",
      department: "BSc Nursing",
    },
  ]);

  console.log("Creating demo lecturer...");
  await User.create({
    name: "Dr. Sarah Kamara",
    email: "lecturer@nuna.edu.sl",
    password: "Lecturer@2026",
    role: "lecturer",
    matricNumber: "LECT001",
    department: "School of Nursing & Midwifery",
    phone: "+232 76 222 222",
  });

  console.log("Seeding hospitals...");
  await ClinicalLocation.insertMany(hospitals);

  console.log("Seeding announcements...");
  await Announcement.insertMany(announcements);

  console.log("Seeding leadership...");
  await Leadership.insertMany(leaders);

  console.log("\nSeed complete!");
  console.log("Admin:", process.env.ADMIN_EMAIL || "admin@nuna.edu.sl");
  console.log("Demo student: student@nuna.edu.sl / Student@2026");
  console.log("Demo lecturer: lecturer@nuna.edu.sl / Lecturer@2026");

  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
