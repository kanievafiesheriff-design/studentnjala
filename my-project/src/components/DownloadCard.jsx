import React from "react";
import { motion } from "framer-motion";
import { Download, FileText, Calendar } from "lucide-react";

function triggerDownload(item) {
  if (item.fileData) {
    const link = document.createElement("a");
    link.href = item.fileData;
    link.download = item.fileName || "download.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const link = document.createElement("a");
  link.href = item.fileUrl;
  link.download = item.fileName || "download.pdf";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function DownloadCard({ item, type = "module" }) {
  const Icon = type === "timetable" ? Calendar : FileText;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md border p-5 flex flex-col h-full hover:shadow-xl transition"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {item.yearLevel}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 mt-2">{item.title}</h3>
          {item.program && (
            <p className="text-xs text-gray-400 mt-0.5">{item.program}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-3 flex-1">{item.description}</p>
      <p className="text-xs text-gray-400 mt-2">{item.size}</p>

      <button
        type="button"
        onClick={() => triggerDownload(item)}
        className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
      >
        <Download size={16} />
        Download
      </button>
    </motion.div>
  );
}
