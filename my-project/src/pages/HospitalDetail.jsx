import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useStudent } from "../context/StudentContext";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  Calendar,
  User,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import placementData from "../data/placementData";

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Completed: "bg-gray-100 text-gray-600",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HospitalDetail() {
  const { id } = useParams();
  const placement = placementData.find((p) => p.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const { checkPending } = useStudent();
  const alreadyApplied = placement ? checkPending(placement.id) : false;

  if (!placement) {
    return <Navigate to="/placements" replace />;
  }

  const { images } = placement;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <Link
          to="/placements"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-6"
        >
          <ArrowLeft size={18} />
          Back to placements
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="relative h-64 md:h-80">
            <img
              src={images[selectedImage]}
              alt={`${placement.hospital} - view ${selectedImage + 1}`}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-semibold ${
                statusStyles[placement.status]
              }`}
            >
              {placement.status}
            </span>
          </div>

          <div className="p-4 border-b bg-gray-50">
            <p className="text-sm text-gray-500 mb-2">Hospital gallery</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-green-600 ring-2 ring-green-200"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {placement.hospital}
            </h1>

            <p className="mt-4 text-gray-600 leading-relaxed">
              {placement.description}
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <DetailRow
                icon={<MapPin size={18} />}
                label="Location"
                value={placement.location}
              />
              <DetailRow
                icon={<Building2 size={18} />}
                label="Department"
                value={placement.department}
              />
              <DetailRow
                icon={<GraduationCap size={18} />}
                label="Level"
                value={placement.level}
              />
              <DetailRow
                icon={<User size={18} />}
                label="Supervisor"
                value={placement.supervisor}
              />
              <DetailRow
                icon={<Calendar size={18} />}
                label="Start date"
                value={formatDate(placement.startDate)}
              />
              <DetailRow
                icon={<Calendar size={18} />}
                label="End date"
                value={formatDate(placement.endDate)}
              />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to={alreadyApplied ? "/my-applications" : `/apply/form/${placement.id}`}
                className="flex-1 text-center py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                {alreadyApplied ? "Application pending — view status" : "Apply for clinical posting"}
              </Link>
              {alreadyApplied && (
                <Link
                  to="/my-applications"
                  className="flex-1 text-center py-3 border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition"
                >
                  My applications
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
      <span className="text-green-600 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}
