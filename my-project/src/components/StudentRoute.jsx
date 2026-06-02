import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStudent } from "../context/StudentContext";

export default function StudentRoute({ children }) {
  const { student, loading } = useStudent();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!student) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
