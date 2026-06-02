import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useStudent } from "../context/StudentContext";

export default function Register() {
  const { student, register, loading } = useStudent();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    matricNumber: "",
    level: "Year 1",
    department: "BSc Nursing",
    phone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        matricNumber: form.matricNumber.trim(),
        level: form.level,
        department: form.department.trim(),
        phone: form.phone.trim(),
      });
      navigate("/apply", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (student) {
    return <Navigate to="/apply" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <UserPlus className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900">Student registration</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Create your NUNAP account to apply for clinical placements.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Full name" name="name" value={form.name} onChange={handleChange} required />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Field
            label="Matric number"
            name="matricNumber"
            value={form.matricNumber}
            onChange={handleChange}
            required
            placeholder="e.g. NUNAP2024001"
          />
          <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year level</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {["Year 1", "Year 2", "Year 3", "Year 4"].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Field
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
