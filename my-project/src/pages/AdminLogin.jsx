import React, { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { getDefaultAdminEmail } from "../utils/adminAuth";

export default function AdminLogin() {
  const { login, isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/admin/dashboard";

  const [email, setEmail] = useState(getDefaultAdminEmail());
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-gray-200">Restoring admin session...</p>
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.message || "Invalid admin email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center gap-2 text-gray-800 mb-2">
          <Shield className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold">Admin login</h1>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Only administrators can add or remove modules and timetables.
        </p>
        <p className="text-xs text-gray-400 mb-6">
          Default (after seed): admin@nuna.edu.sl / NUNA@Admin2026
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Sign in as admin
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to student portal
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
