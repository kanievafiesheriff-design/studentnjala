import modulesData from "../data/modulesData";
import timetableData from "../data/timetableData";

const CUSTOM_MODULES_KEY = "nunap_custom_modules";
const CUSTOM_TIMETABLES_KEY = "nunap_custom_timetables";
export const CONTENT_UPDATED_EVENT = "nunap-content-updated";

export function notifyContentUpdated() {
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
}

function readList(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function writeList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function getCustomModules() {
  return readList(CUSTOM_MODULES_KEY);
}

export function getCustomTimetables() {
  return readList(CUSTOM_TIMETABLES_KEY);
}

export function getAllModules() {
  const builtin = modulesData.map((m) => ({ ...m, isBuiltin: true }));
  const custom = getCustomModules().map((m) => ({ ...m, isBuiltin: false }));
  return [...builtin, ...custom];
}

export function getAllTimetables() {
  const builtin = timetableData.map((t) => ({ ...t, isBuiltin: true }));
  const custom = getCustomTimetables().map((t) => ({ ...t, isBuiltin: false }));
  return [...builtin, ...custom];
}

export function addCustomModule(module) {
  const list = getCustomModules();
  list.push(module);
  writeList(CUSTOM_MODULES_KEY, list);
  notifyContentUpdated();
  return module;
}

export function addCustomTimetable(timetable) {
  const list = getCustomTimetables();
  list.push(timetable);
  writeList(CUSTOM_TIMETABLES_KEY, list);
  notifyContentUpdated();
  return timetable;
}

export function updateCustomModule(id, updates) {
  const list = getCustomModules();
  const index = list.findIndex((m) => m.id === id);
  if (index === -1) return null;
  const updated = { ...list[index], ...updates, id };
  list[index] = updated;
  writeList(CUSTOM_MODULES_KEY, list);
  notifyContentUpdated();
  return updated;
}

export function updateCustomTimetable(id, updates) {
  const list = getCustomTimetables();
  const index = list.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const updated = { ...list[index], ...updates, id };
  list[index] = updated;
  writeList(CUSTOM_TIMETABLES_KEY, list);
  notifyContentUpdated();
  return updated;
}

export function deleteCustomModule(id) {
  writeList(
    CUSTOM_MODULES_KEY,
    getCustomModules().filter((m) => m.id !== id)
  );
  notifyContentUpdated();
}

export function deleteCustomTimetable(id) {
  writeList(
    CUSTOM_TIMETABLES_KEY,
    getCustomTimetables().filter((t) => t.id !== id)
  );
  notifyContentUpdated();
}

export function formatFileSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
