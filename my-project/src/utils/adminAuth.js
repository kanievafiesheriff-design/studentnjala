const ADMIN_SESSION_KEY = "nunap_admin_session";

// Default admin credentials — change in production or connect to a backend
const ADMIN_CREDENTIALS = {
  email: "admin@nuna.edu.sl",
  password: "NUNA@Admin2026",
};

export function validateAdmin(email, password) {
  return (
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  );
}

export function getAdminSession() {
  try {
    const data = localStorage.getItem(ADMIN_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveAdminSession(admin) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getDefaultAdminEmail() {
  return ADMIN_CREDENTIALS.email;
}
