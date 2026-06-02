import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Users,
} from "lucide-react";

const galleryImages = [
  {
    src: "/contact/campus-group.png",
    alt: "Nursing students gathered on campus",
    caption: "Student community on campus",
  },
  {
    src: "/contact/lecture-ent.png",
    alt: "Public lecture on ENT",
    caption: "Public lecture — ENT",
  },
  {
    src: "/contact/classroom.png",
    alt: "Students in lecture hall",
    caption: "Lecture hall sessions",
  },
  {
    src: "/contact/students-lecture.png",
    alt: "Nursing students in class",
    caption: "Classroom learning",
  },
];

const contactDetails = [
  {
    icon: MapPin,
    title: "Location",
    lines: [
      "School of Nursing and Midwifery",
      "Njala University, Bo Campus",
      "Bo, Southern Province, Sierra Leone",
    ],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["nunap@njala.edu.sl", "nursing@njala.edu.sl"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+232 76 000 000", "+232 88 000 000"],
  },
  {
    icon: Clock,
    title: "Office hours",
    lines: ["Mon – Fri: 8:00 AM – 4:00 PM", "Sat: 9:00 AM – 12:00 PM"],
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <img
          src="/contact/campus-group.png"
          alt="Njala University School of Nursing and Midwifery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 to-blue-700/70" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
              Get in touch
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mt-2">Contact Us</h1>
            <p className="mt-3 text-lg text-blue-100 max-w-2xl">
              Njala University Nurses Association — School of Nursing and Midwifery
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-16">
        {/* About the organisation */}
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-blue-600 mb-3">
              <Building2 size={22} />
              <span className="font-semibold text-sm uppercase tracking-wide">
                Our organisation
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Njala University Nurses Association
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              The Njala University Nurses Association (NUNAP) serves students of the
              School of Nursing and Midwifery at Njala University. We support academic
              excellence, clinical placement coordination, student welfare, and professional
              development for future nurses and midwives in Sierra Leone.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Through this portal, students can download study modules and timetables,
              apply for hospital clinical postings, track applications, and stay updated
              with announcements from faculty and association leadership.
            </p>
            <div className="mt-6 flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Users className="text-blue-600 shrink-0" size={28} />
              <div>
                <p className="font-semibold text-gray-900">Who we serve</p>
                <p className="text-sm text-gray-600">
                  BSc Nursing students, clinical supervisors, lecturers, and administrators
                  across all year levels.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3"
          >
            {galleryImages.map((img, i) => (
              <div
                key={img.src}
                className={`relative overflow-hidden rounded-xl shadow-md group ${
                  i === 0 ? "col-span-2 h-48" : "h-36"
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                  <p className="text-white text-xs font-medium">{img.caption}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Contact details + form */}
        <section className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact information</h2>
            <p className="text-gray-600 text-sm mb-6">
              Reach the Nurses Association office for placement enquiries, academic support,
              or general questions.
            </p>
            {contactDetails.map(({ icon: Icon, title, lines }) => (
              <div
                key={title}
                className="flex gap-4 p-4 bg-white rounded-xl border shadow-sm"
              >
                <div className="p-2 h-fit rounded-lg bg-blue-100 text-blue-600">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  {lines.map((line) => (
                    <p key={line} className="text-sm text-gray-600 mt-0.5">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 bg-white rounded-xl border shadow-sm p-6 md:p-8 space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900">Send a message</h2>
            <p className="text-sm text-gray-500">
              Fill in the form below and we will get back to you as soon as possible.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Field
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <Field
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="How can we help you?"
              />
            </div>

            {submitted && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3">
                Thank you! Your message has been received. We will respond to your email
                shortly.
              </p>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              <Send size={18} />
              Send message
            </button>
          </motion.form>
        </section>

        {/* Mission strip */}
        <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 md:p-10 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Our mission</h2>
          <p className="mt-4 max-w-3xl mx-auto text-blue-100 leading-relaxed">
            To train competent, compassionate nurses and midwives who improve health
            outcomes in Sierra Leone and beyond — through quality education, hands-on
            clinical experience, and strong student leadership.
          </p>
        </section>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
