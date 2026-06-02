import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AnnouncementCard, { categoryStyles } from "../components/AnnouncementCard";
import { announcementsAPI } from "../services/api";
import { mapAnnouncement } from "../utils/downloadHelpers";

const categories = [
  "All",
  "Announcement",
  "News",
  "Update",
  "Clinical Posting",
  "Academic",
  "Clinical",
  "Events",
  "General",
];

export default function Announcement() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await announcementsAPI.getAll();
        setAnnouncements((res.data.data || []).map(mapAnnouncement));
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load announcements"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sorted = useMemo(
    () =>
      [...announcements].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
    [announcements]
  );

  const featured = sorted.find((a) => a.pinned) || sorted[0];

  const filtered = useMemo(() => {
    return sorted.filter((item) => {
      if (item.id === featured?.id) return false;
      const matchesCategory = filter === "All" || item.category === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [sorted, filter, search, featured]);

  const urgentCount = announcements.filter((a) => a.urgent).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-14 px-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Bell size={16} />
            Latest updates from faculty & leadership
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">Announcements</h1>
          <p className="mt-3 text-blue-100 text-lg max-w-2xl mx-auto">
            Stay informed about timetables, clinical postings, exams, and
            association news.
          </p>
          {urgentCount > 0 && (
            <p className="mt-4 inline-flex items-center gap-2 bg-red-500/90 text-white text-sm font-medium px-4 py-2 rounded-full">
              <Sparkles size={16} />
              {urgentCount} urgent {urgentCount === 1 ? "notice" : "notices"}
            </p>
          )}
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : cat !== "All" && categoryStyles[cat]
                    ? `${categoryStyles[cat]} hover:opacity-90`
                    : "bg-white border text-gray-600 hover:border-blue-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-500 py-12">Loading announcements...</p>
        ) : (
          <>
            {featured && filter === "All" && !search.trim() && (
              <AnnouncementCard
                announcement={featured}
                featured
                expanded={expandedId === featured.id}
                onToggle={() =>
                  setExpandedId(expandedId === featured.id ? null : featured.id)
                }
              />
            )}

            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border">
                  <Bell className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-500 font-medium">
                    No announcements found
                  </p>
                </div>
              ) : (
                filtered.map((item, index) => (
                  <AnnouncementCard
                    key={item.id}
                    announcement={item}
                    index={index}
                    expanded={expandedId === item.id}
                    onToggle={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                  />
                ))
              )}
            </div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-4 pt-4"
        >
          <Link
            to="/modules"
            className="p-5 bg-white rounded-xl border hover:border-blue-300 hover:shadow-md transition group"
          >
            <p className="font-semibold text-gray-900 group-hover:text-blue-600">
              Download modules & timetable →
            </p>
          </Link>
          <Link
            to="/apply"
            className="p-5 bg-white rounded-xl border hover:border-blue-300 hover:shadow-md transition group"
          >
            <p className="font-semibold text-gray-900 group-hover:text-blue-600">
              Apply for clinical posting →
            </p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
