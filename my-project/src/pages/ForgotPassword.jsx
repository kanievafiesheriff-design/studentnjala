import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const response = await authAPI.forgotPassword({ email: email.trim() });
      setMessage(
        response.data.message ||
          "If that email exists, password reset instructions were sent."
      );
      if (response.data.resetToken) {
        setMessage(
          (prev) =>
            `${prev} (Dev mode: use token in reset link) — /reset-password/${response.data.resetToken}`
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not process request. Ensure the API server is running."
      );
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
        <h1 className="text-2xl font-bold text-gray-900">Forgot password</h1>
        <p className="text-gray-500 text-sm mt-2">
          Enter your email and we will help you reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}
          {message && (
            <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{message}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send reset link"}
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
