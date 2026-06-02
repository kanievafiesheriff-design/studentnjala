const API_BASE = (
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

export function assetUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

export default assetUrl;
