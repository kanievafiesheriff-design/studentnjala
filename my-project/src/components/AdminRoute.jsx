import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Restoring session...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
