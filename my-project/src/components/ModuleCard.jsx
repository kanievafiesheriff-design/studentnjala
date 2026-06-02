import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

function downloadItem(item) {
  if (item.fileData) {
    const link = document.createElement("a");
    link.href = item.fileData;
    link.download = item.fileName || "download.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  if (item.fileUrl) {
    const link = document.createElement("a");
    link.href = item.fileUrl;
    link.download = item.fileName || "download.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default function ModuleCard({ module: mod }) {
  if (mod) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 bg-white rounded-xl shadow-md border hover:shadow-xl transition"
      >
        <h3 className="text-xl font-semibold text-gray-800">{mod.title}</h3>
        <p className="text-gray-500 mt-2 text-sm line-clamp-2">{mod.description}</p>
        <button
          type="button"
          onClick={() => downloadItem(mod)}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm"
        >
          <Download size={16} />
          Download
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white rounded-xl shadow-md border hover:shadow-xl transition"
    >
      <h3 className="text-xl font-semibold text-gray-800">Study modules</h3>
      <p className="text-gray-500 mt-2 text-sm">View and download module materials.</p>
      <Link
        to="/modules"
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm"
      >
        View modules
      </Link>
    </motion.div>
  );
}
