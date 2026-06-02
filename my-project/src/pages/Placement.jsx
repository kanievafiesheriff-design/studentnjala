import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import placementData from "../data/placementData";
import PlacementCard from "../components/PlacementCard";

export default function Placement() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <section className="bg-gradient-to-r from-green-600 to-teal-500 text-white py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold">Clinical Placements</h1>
          <p className="mt-3 text-lg text-green-50 max-w-2xl mx-auto">
            Browse partner hospitals, view photos, and apply for clinical posting
            at different hospitals.
          </p>
          <Link
            to="/apply"
            className="inline-block mt-6 px-6 py-3 bg-white text-green-700 font-semibold rounded-full hover:scale-105 transition shadow-lg"
          >
            Go to apply for posting
          </Link>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placementData.map((placement) => (
            <PlacementCard key={placement.id} placement={placement} />
          ))}
        </div>
      </div>
    </div>
  );
}
