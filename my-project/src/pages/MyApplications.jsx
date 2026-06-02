import React from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardList, Plus } from "lucide-react";
import { useStudent } from "../context/StudentContext";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MyApplications() {
  const { student, applications, loading } = useStudent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Restoring session...</p>
      </div>
    );
  }

  if (!student) {
    return <Navigate to="/login" state={{ from: "/my-applications" }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-green-700">
              <ClipboardList size={22} />
              <span className="font-medium">My applications</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">Clinical posting requests</h1>
            <p className="text-gray-500 text-sm mt-1">
              {student.fullName} · {student.studentId}
            </p>
          </div>
          <Link
            to="/apply/form"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={18} />
            New application
          </Link>
        </div>

        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow p-10 text-center"
          >
            <p className="text-gray-600">You have not applied for any clinical posting yet.</p>
            <Link
              to="/apply"
              className="inline-block mt-4 text-green-700 font-medium hover:underline"
            >
              Go to apply for posting →
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {applications
              .slice()
              .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
              .map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md border p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {app.hospitalName}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[app.status] || statusStyles.Pending
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <dl className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <dt className="text-gray-400">Location</dt>
                      <dd>{app.location}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Department</dt>
                      <dd>{app.department}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Preferred start</dt>
                      <dd>
                        {new Date(app.preferredStartDate).toLocaleDateString("en-GB")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Applied on</dt>
                      <dd>{formatDate(app.appliedAt)}</dd>
                    </div>
                  </dl>

                  {app.reason && (
                    <p className="mt-3 text-sm text-gray-600 border-t pt-3">
                      <span className="text-gray-400">Reason: </span>
                      {app.reason}
                    </p>
                  )}
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
