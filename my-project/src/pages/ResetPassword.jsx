import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI, saveToken } from "../services/api";
import { saveStudent } from "../utils/applicationStorage";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authAPI.resetPassword(token, { password });
      const user = response.data.user;
      saveToken(response.data.token);
      saveStudent({
        studentId: user.matricNumber,
        fullName: user.name,
        email: user.email,
        phone: user.phone || "",
        yearLevel: user.level || "Year 1",
        department: user.department || "BSc Nursing",
      });
      navigate("/apply", { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
        <p className="text-gray-500 text-sm mt-2">Enter your new password below.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">
            ← Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
