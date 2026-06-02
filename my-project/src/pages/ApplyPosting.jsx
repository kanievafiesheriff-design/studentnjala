import React, { useState } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, CheckCircle, ArrowLeft } from "lucide-react";
import placementData from "../data/placementData";
import { useStudent } from "../context/StudentContext";

export default function ApplyPosting() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const { student, submitApplication, checkPending, loading } = useStudent();

  const preselected = hospitalId
    ? placementData.find((p) => p.id === Number(hospitalId))
    : null;

  const [form, setForm] = useState({
    hospitalId: preselected?.id?.toString() || "",
    preferredDepartment: preselected?.department || "",
    preferredStartDate: preselected?.startDate || "",
    reason: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Restoring session...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <Navigate
        to="/login"
        state={{
          from: `/apply/form${hospitalId ? `/${hospitalId}` : ""}`,
        }}
        replace
      />
    );
  }

  const selectedHospital = placementData.find(
    (p) => p.id === Number(form.hospitalId)
  );

  const handleHospitalChange = (e) => {
    const id = e.target.value;
    const hospital = placementData.find((p) => p.id === Number(id));
    setForm({
      ...form,
      hospitalId: id,
      preferredDepartment: hospital?.department || "",
      preferredStartDate: hospital?.startDate || "",
    });
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedHospital) {
      setError("Please select a hospital.");
      return;
    }

    if (checkPending(selectedHospital.id)) {
      setError(
        `You already have a pending application for ${selectedHospital.hospital}.`
      );
      return;
    }

    submitApplication({
      id: `app-${Date.now()}`,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.hospital,
      location: selectedHospital.location,
      department: form.preferredDepartment,
      preferredStartDate: form.preferredStartDate,
      reason: form.reason,
      studentId: student.studentId,
      studentName: student.fullName,
      email: student.email,
      phone: student.phone,
      yearLevel: student.yearLevel,
      status: "Pending",
      appliedAt: new Date().toISOString(),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <CheckCircle className="mx-auto text-green-600" size={56} />
          <h1 className="text-2xl font-bold mt-4">Application submitted</h1>
          <p className="text-gray-600 mt-2">
            Your request for clinical posting at{" "}
            <strong>{selectedHospital?.hospital}</strong> is pending review.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/my-applications"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              View my applications
            </Link>
            <Link
              to="/apply"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 inline-block"
            >
              Apply to another hospital
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/apply"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-4"
        >
          <ArrowLeft size={18} />
          Back to apply page
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <FileText size={22} />
            <span className="font-medium">Clinical posting application</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Apply for hospital posting
          </h1>
          <p className="text-gray-600 mt-2">
            Logged in as <strong>{student.fullName}</strong> ({student.studentId})
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select hospital *
            </label>
            <select
              name="hospitalId"
              value={form.hospitalId}
              onChange={handleHospitalChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Choose a hospital...</option>
              {placementData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.hospital} — {p.location}
                </option>
              ))}
            </select>
          </div>

          {selectedHospital && (
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <img
                src={selectedHospital.image}
                alt={selectedHospital.hospital}
                className="w-24 h-20 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold">{selectedHospital.hospital}</p>
                <p className="text-sm text-gray-500">{selectedHospital.location}</p>
                <p className="text-sm text-gray-500">
                  Supervisor: {selectedHospital.supervisor}
                </p>
              </div>
            </div>
          )}

          <Field
            label="Preferred department"
            name="preferredDepartment"
            value={form.preferredDepartment}
            onChange={handleChange}
            required
          />
          <Field
            label="Preferred start date"
            name="preferredStartDate"
            type="date"
            value={form.preferredStartDate}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Why do you want this posting? *
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Briefly explain your interest and readiness for this placement..."
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none resize-none"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Submit application
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </motion.form>
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
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
      />
    </div>
  );
}
