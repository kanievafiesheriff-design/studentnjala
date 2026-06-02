import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import ModuleCard from "../components/ModuleCard";
import PlacementCard from "../components/PlacementCard";
import placementData from "../data/placementData";
import { useContent } from "../hooks/useContent";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Welcome to Njala University Nurses Association",
    desc: "School of Nursing and Midwifery — empowering students with clinical excellence",
    image: "/hero/hero-1.png",
    to: "/modules",
    cta: "Get started",
  },
  {
    title: "Download Study Modules",
    desc: "Access lecture notes and course materials anytime",
    image: "/hero/hero-2.png",
    to: "/modules",
    cta: "Download modules",
  },
  {
    title: "Clinical Placement",
    desc: "Apply for hospital postings across Sierra Leone",
    image: "/hero/hero-3.png",
    to: "/apply",
    cta: "Apply for posting",
  },
  {
    title: "Learn. Practice. Serve.",
    desc: "Join your peers in lectures, labs, and community health outreach",
    image: "/hero/hero-4.png",
    to: "/placements",
    cta: "View hospitals",
  },
];

export default function Home() {
  const { modules } = useContent();
  const [index, setIndex] = useState(0);

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* HERO SLIDER */}
      <section className="relative h-[80vh] min-h-[420px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src={slides[index].image}
              alt="Njala University School of Nursing and Midwifery students"
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/75 via-blue-900/50 to-blue-950/80" />
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-6 pt-16">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-4xl drop-shadow-lg"
              >
                {slides[index].title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-base sm:text-lg md:text-xl max-w-2xl text-blue-50 drop-shadow"
              >
                {slides[index].desc}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <Link
                  to={slides[index].to}
                  className="inline-block mt-6 px-8 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:scale-105 transition"
                >
                  {slides[index].cta}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* MODULE SECTION */}
      <section className="py-16 px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-10"
        >
          📚 Latest Modules
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.slice(0, 3).map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/modules"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
          >
            View all modules & timetables
          </Link>
        </div>
      </section>

      {/* PLACEMENT SECTION */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-10"
        >
          🏥 Clinical Placement Updates
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placementData.slice(0, 3).map((placement) => (
            <PlacementCard key={placement.id} placement={placement} />
          ))}
        </div>

        <div className="text-center mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/apply"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
          >
            Apply for clinical posting
          </Link>
          <Link
            to="/placements"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition"
          >
            View all hospitals
          </Link>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 text-center bg-blue-600 text-white">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-bold"
        >
          Start Your Nursing Journey Today
        </motion.h2>

        <p className="mt-3 text-lg">
          Join thousands of nursing students in Sierra Leone
        </p>

        <Link
          to="/apply"
          className="inline-block mt-6 px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:scale-105 transition shadow-lg"
        >
          Register Now
        </Link>
      </section>
    </div>
  );
}