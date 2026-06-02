import React, { useEffect, useState } from "react";
import { Megaphone, Pencil, Trash2 } from "lucide-react";
import { announcementsAPI } from "../services/api";
import assetUrl from "../utils/assetUrl";

const categories = [
  "Announcement",
  "News",
  "Update",
  "Clinical Posting",
  "Academic",
  "Clinical",
  "Events",
  "General",
];

const emptyForm = {
  title: "",
  content: "",
  category: "Announcement",
  author: "NUNA Admin",
  pinned: false,
  urgent: false,
  file: null,
};

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementsAPI.getAll();
      setItems(res.data.data || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      content: item.content,
      category: item.category,
      author: item.author || "NUNA Admin",
      pinned: !!item.pinned,
      urgent: !!item.urgent,
      file: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("content", form.content.trim());
    payload.append("category", form.category);
    payload.append("author", form.author.trim());
    payload.append("pinned", String(form.pinned));
    payload.append("urgent", String(form.urgent));
    if (form.file) payload.append("file", form.file);

    try {
      if (editingId) {
        await announcementsAPI.update(editingId, payload);
        setMessage("Announcement updated.");
      } else {
        await announcementsAPI.create(payload);
        setMessage("Announcement published.");
      }
      resetForm();
      await loadAnnouncements();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await announcementsAPI.remove(id);
      setMessage("Announcement deleted.");
      if (editingId === id) resetForm();
      await loadAnnouncements();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not delete announcement");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="text-blue-700" size={22} />
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit announcement" : "Create announcement"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Title"
              className="border rounded-lg px-3 py-2 w-full"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author name"
            className="border rounded-lg px-3 py-2 w-full"
          />

          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Announcement content"
            className="border rounded-lg px-3 py-2 w-full resize-none"
          />

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="pinned"
                checked={form.pinned}
                onChange={handleChange}
              />
              Pin to top
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="urgent"
                checked={form.urgent}
                onChange={handleChange}
              />
              Mark urgent
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Attachment (PDF or image, optional)
            </label>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="block w-full text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update announcement"
                  : "Publish announcement"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border px-5 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>

        {message && (
          <p className="mt-4 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
            {message}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Published announcements</h3>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No announcements yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="border rounded-lg p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.category} · {item.author}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {item.content}
                </p>
                {item.fileUrl && (
                  <a
                    href={assetUrl(item.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 mt-2 inline-block hover:underline"
                  >
                    View attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
