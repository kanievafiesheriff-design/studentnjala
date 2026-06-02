import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CalendarDays } from "lucide-react";
import { useContent } from "../hooks/useContent";
import DownloadCard from "../components/DownloadCard";

const yearFilters = ["All", "Year 1", "Year 2", "Year 3", "All Years"];

export default function Module() {
  const { modules, timetables } = useContent();
  const [moduleFilter, setModuleFilter] = useState("All");
  const filterItems = (items, filter) => {
    if (filter === "All") return items;
    return items.filter((item) => item.yearLevel === filter);
  };

  const filteredModules = filterItems(modules, moduleFilter);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <section className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold">Modules & Timetables</h1>
          <p className="mt-3 text-blue-100 text-lg">
            Download study modules and class timetables uploaded by your faculty.
          </p>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-14">
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Study modules</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {yearFilters.map((year) => (
                <button
                  key={`mod-${year}`}
                  type="button"
                  onClick={() => setModuleFilter(year)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    moduleFilter === year
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-gray-600 hover:border-blue-400"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <DownloadCard key={module.id} item={module} type="module" />
            ))}
          </div>

          {filteredModules.length === 0 && (
            <p className="text-center text-gray-500 py-8">No modules for this year level.</p>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="text-indigo-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Timetable</h2>
          </div>

          <div className="max-w-md">
            {timetables.map((timetable) => (
              <DownloadCard key={timetable.id} item={timetable} type="timetable" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
