import React, { createContext, useContext, useState, useEffect } from "react";
import { getAdminSession, saveAdminSession, clearAdminSession } from "../utils/adminAuth";
import { clearToken } from "../services/api";
import { authAPI, saveToken } from "../services/api";
const url = "https://studentnjalabackend.onrender.com";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getAdminSession();
    if (saved) {
      setAdmin(saved);
    }

    const restoreAdminSession = async () => {
      const token = localStorage.getItem("nunap_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.me();
        const user = response.data.user;
        if (user?.role !== "admin") {
          clearToken();
          clearAdminSession();
          setAdmin(null);
          setLoading(false);
          return;
        }

        const restoredAdmin = {
          email: user.email,
          name: user.name,
          role: user.role,
          loggedInAt: new Date().toISOString(),
        };

        saveAdminSession(restoredAdmin);
        setAdmin(restoredAdmin);
      } catch (error) {
        clearToken();
        clearAdminSession();
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAdminSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({
        email: email.trim().toLowerCase(),
        password,
      });
      const user = response.data.user;
      if (user.role !== "admin") {
        return {
          success: false,
          message:
            "This account is not an administrator. Use the student login page instead.",
        };
      }

      const session = {
        email: user.email,
        name: user.name,
        role: user.role,
        loggedInAt: new Date().toISOString(),
      };
      saveToken(response.data.token);
      saveAdminSession(session);
      setAdmin(session);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Cannot reach the server. Start the backend (npm run dev in /backend)."
          : "Invalid admin email or password.");
      return { success: false, message };
    }
  };

  const logout = () => {
    clearToken();
    clearAdminSession();
    setAdmin(null);
  };

  return (
    <AdminContext.Provider
      value={{ admin, loading, login, logout, isAdmin: !!admin }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
