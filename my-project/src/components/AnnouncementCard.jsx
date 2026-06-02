import React from "react";
import { motion } from "framer-motion";
import assetUrl from "../utils/assetUrl";
import {
  Calendar,
  ChevronDown,
  Download,
  Megaphone,
  Paperclip,
  Pin,
  User,
} from "lucide-react";

const categoryStyles = {
  Announcement: "bg-slate-100 text-slate-700 border-slate-200",
  News: "bg-blue-100 text-blue-700 border-blue-200",
  Update: "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Clinical Posting": "bg-emerald-100 text-emerald-700 border-emerald-200",
  Academic: "bg-sky-100 text-sky-700 border-sky-200",
  Clinical: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Events: "bg-purple-100 text-purple-700 border-purple-200",
  General: "bg-gray-100 text-gray-700 border-gray-200",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function triggerDownload(item) {
  const url = assetUrl(item.fileUrl);
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  link.download = item.fileName || "attachment.pdf";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function AnnouncementCard({
  announcement,
  expanded,
  onToggle,
  featured = false,
  index = 0,
}) {
  const { title, content, category, author, date, pinned, urgent, fileUrl, fileName } =
    announcement;
  const style = categoryStyles[category] || categoryStyles.General;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition-shadow ${
        featured ? "ring-2 ring-blue-500/30" : ""
      } ${urgent && !featured ? "border-l-4 border-l-red-500" : ""}`}
    >
      {featured && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 flex items-center gap-2 text-white text-xs font-semibold uppercase tracking-wide">
          <Megaphone size={14} />
          Featured announcement
        </div>
      )}

      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style}`}>
            {category}
          </span>
          {pinned && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
              <Pin size={12} />
              Pinned
            </span>
          )}
          {urgent && (
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
              Urgent
            </span>
          )}
        </div>

        <h3
          className={`font-bold text-gray-900 leading-snug ${
            featured ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {title}
        </h3>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <User size={14} />
            {author}
          </span>
        </div>

        <p
          className={`mt-4 text-gray-600 leading-relaxed ${
            expanded ? "" : "line-clamp-2"
          }`}
        >
          {content}
        </p>

        {expanded && fileUrl && (
          <button
            type="button"
            onClick={() => triggerDownload(announcement)}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition"
          >
            <Paperclip size={16} />
            {fileName || "Download attachment"}
            <Download size={14} />
          </button>
        )}

        <button
          type="button"
          onClick={onToggle}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
        >
          {expanded ? "Show less" : "Read more"}
          <ChevronDown
            size={16}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </motion.article>
  );
}

export { formatDate, categoryStyles };
