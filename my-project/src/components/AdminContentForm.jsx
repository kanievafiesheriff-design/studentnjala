import React, { useEffect, useState } from "react";
import {
  addCustomModule,
  addCustomTimetable,
  formatFileSize,
  readFileAsDataUrl,
  updateCustomModule,
  updateCustomTimetable,
} from "../utils/contentStorage";

const yearOptions = ["Year 1", "Year 2", "Year 3", "All Years"];
const MAX_FILE_BYTES = 4 * 1024 * 1024;

const emptyForm = {
  title: "",
  description: "",
  yearLevel: "Year 1",
  program: "BSc Nursing",
};

export default function AdminContentForm({ type, editingItem, onAdded, onCancelEdit }) {
  const isTimetable = type === "timetable";
  const isReplace = Boolean(editingItem);

  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title || "",
        description: editingItem.description || "",
        yearLevel: editingItem.yearLevel || "Year 1",
        program: editingItem.program || "BSc Nursing",
      });
      setFile(null);
      setFileInputKey((k) => k + 1);
      setError("");
      setSuccess("");
    } else {
      setForm(emptyForm);
      setFile(null);
      setFileInputKey((k) => k + 1);
      setError("");
      setSuccess("");
    }
  }, [editingItem, type]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFile = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_BYTES) {
      setError("File must be 4 MB or smaller.");
      setFile(null);
      return;
    }
    setFile(selected);
    setError("");
  };

  const resetAddForm = () => {
    setForm(emptyForm);
    setFile(null);
    setFileInputKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isReplace && !file) {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let filePayload = {};
      if (file) {
        const fileData = await readFileAsDataUrl(file);
        filePayload = {
          fileName: file.name,
          fileData,
          size: formatFileSize(file.size),
        };
      } else if (isReplace) {
        filePayload = {
          fileName: editingItem.fileName,
          fileData: editingItem.fileData,
          fileUrl: editingItem.fileUrl,
          size: editingItem.size,
        };
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        yearLevel: form.yearLevel,
        ...filePayload,
      };

      if (isReplace) {
        if (isTimetable) {
          updateCustomTimetable(editingItem.id, {
            ...payload,
            program: form.program.trim() || "BSc Nursing",
          });
        } else {
          updateCustomModule(editingItem.id, payload);
        }
        setSuccess(
          `${isTimetable ? "Timetable" : "Module"} replaced successfully. Students will see the update.`
        );
        onAdded?.();
        onCancelEdit?.();
      } else {
        const base = {
          id: `admin-${type}-${Date.now()}`,
          ...payload,
          addedAt: new Date().toISOString(),
        };

        if (isTimetable) {
          addCustomTimetable({
            ...base,
            program: form.program.trim() || "BSc Nursing",
          });
        } else {
          addCustomModule(base);
        }

        resetAddForm();
        setSuccess(
          `${isTimetable ? "Timetable" : "Module"} added successfully. Students can download it now.`
        );
        onAdded?.();
      }
    } catch {
      setError("Could not read file. Try again with a smaller PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border shadow-sm p-6 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {isReplace
            ? `Replace ${isTimetable ? "timetable" : "module"}`
            : `Add new ${isTimetable ? "timetable" : "module"}`}
        </h3>
        {isReplace && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
        )}
      </div>

      {isReplace && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          Updating <strong>{editingItem.title}</strong>. Upload a new PDF only if you want to
          change the file; leave it empty to keep the current document.
        </p>
      )}

      <Field label="Title *" name="title" value={form.title} onChange={handleChange} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year level *
          </label>
          <select
            name="yearLevel"
            value={form.yearLevel}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        {isTimetable && (
          <Field
            label="Program"
            name="program"
            value={form.program}
            onChange={handleChange}
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          PDF file {isReplace ? "(optional — new file)" : "*"} (max 4 MB)
        </label>
        <input
          key={fileInputKey}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFile}
          required={!isReplace}
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
        />
        {file ? (
          <p className="text-xs text-gray-500 mt-1">
            Selected: {file.name} ({formatFileSize(file.size)})
          </p>
        ) : (
          isReplace && (
            <p className="text-xs text-gray-500 mt-1">
              Current file: {editingItem.fileName || "PDF on record"}
            </p>
          )
        )}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {loading
          ? "Saving..."
          : isReplace
            ? `Save ${isTimetable ? "timetable" : "module"} changes`
            : `Publish ${isTimetable ? "timetable" : "module"}`}
      </button>
    </form>
  );
}

function Field({ label, name, value, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
