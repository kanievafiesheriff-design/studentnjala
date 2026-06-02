import React, { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useStudent } from "../context/StudentContext";

export default function Login() {
  const { student, login, loading } = useStudent();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/apply";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Restoring session...</p>
      </div>
    );
  }

  if (student) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <LogIn className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-900">Student login</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Sign in with your registered email and password to apply for clinical posting.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="student@email.com"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Your password"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-500">
          No account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Create student account
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-gray-500">
          <Link to="/placements" className="text-blue-600 hover:underline">
            Browse hospitals
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
