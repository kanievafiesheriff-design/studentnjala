import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Building2 } from "lucide-react";

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Completed: "bg-gray-100 text-gray-600",
};

export default function PlacementCard({ placement }) {
  const { id, hospital, location, department, status, image } = placement;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-xl transition"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={hospital}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
            statusStyles[status] || statusStyles.Upcoming
          }`}
        >
          {status}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {hospital}
        </h3>

        <p className="flex items-center gap-1 text-sm text-gray-500 mt-2">
          <MapPin size={14} />
          {location}
        </p>

        <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <Building2 size={14} />
          {department}
        </p>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/placements/${id}`}
            className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition text-sm"
          >
            View
          </Link>
          <Link
            to={`/apply/form/${id}`}
            className="flex-1 text-center px-4 py-2 border border-green-600 text-green-700 rounded-full hover:bg-green-50 transition text-sm"
          >
            Apply
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
