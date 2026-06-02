import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Hospital,
  LogIn,
  MapPin,
  Send,
  Building2,
} from "lucide-react";
import placementData from "../data/placementData";
import { useStudent } from "../context/StudentContext";

const steps = [
  {
    icon: LogIn,
    title: "Student login",
    desc: "Sign in with your email and password (or create an account).",
  },
  {
    icon: Hospital,
    title: "Choose hospital",
    desc: "Pick a partner hospital for your clinical posting.",
  },
  {
    icon: Send,
    title: "Submit application",
    desc: "Fill the form and track status under My Applications.",
  },
];

export default function ApplyForPosting() {
  const { student, checkPending, loading } = useStudent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Restoring session...</p>
      </div>
    );
  }

  const applyLink = (hospitalId) => {
    const path = `/apply/form/${hospitalId}`;
    if (!student) {
      return { pathname: "/login", state: { from: path } };
    }
    return path;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-600 text-white py-14 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <ClipboardList className="mx-auto mb-4 opacity-90" size={48} />
          <h1 className="text-3xl md:text-4xl font-bold">
            Apply for Clinical Posting
          </h1>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            This is where nursing students apply for hospital clinical postings.
            Choose a hospital below and submit your application online.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {student ? (
              <>
                <Link
                  to="/apply/form"
                  className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:scale-105 transition shadow-lg"
                >
                  Start new application
                </Link>
                <Link
                  to="/my-applications"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition"
                >
                  My applications
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                state={{ from: "/apply" }}
                className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:scale-105 transition shadow-lg"
              >
                Login to apply
              </Link>
            )}
          </div>

          {student && (
            <p className="mt-4 text-sm text-blue-100">
              Signed in as <strong>{student.fullName}</strong> ({student.studentId})
            </p>
          )}
        </motion.div>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
          How to apply
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md border text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <step.icon size={24} />
              </div>
              <p className="text-xs text-blue-600 font-semibold mt-4">Step {i + 1}</p>
              <h3 className="font-semibold text-gray-900 mt-1">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Select a hospital to apply
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placementData.map((placement, index) => {
            const pending = student ? checkPending(placement.id) : false;
            const target = applyLink(placement.id);

            return (
              <motion.div
                key={placement.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md border overflow-hidden"
              >
                <img
                  src={placement.image}
                  alt={placement.hospital}
                  className="w-full h-36 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {placement.hospital}
                  </h3>
                  <p className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <MapPin size={14} />
                    {placement.location}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Building2 size={14} />
                    {placement.department}
                  </p>

                  {pending ? (
                    <Link
                      to="/my-applications"
                      className="mt-4 block w-full text-center py-2.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium"
                    >
                      Application pending
                    </Link>
                  ) : typeof target === "string" ? (
                    <Link
                      to={target}
                      className="mt-4 block w-full text-center py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
                    >
                      Apply here
                    </Link>
                  ) : (
                    <Link
                      to={target.pathname}
                      state={target.state}
                      className="mt-4 block w-full text-center py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
                    >
                      Apply here
                    </Link>
                  )}

                  <Link
                    to={`/placements/${placement.id}`}
                    className="mt-2 block w-full text-center py-2 text-sm text-blue-600 hover:underline"
                  >
                    View hospital details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
