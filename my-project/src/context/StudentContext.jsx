import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { saveStudent, clearStudent } from "../utils/applicationStorage";
import { authAPI, applicationsAPI, saveToken, clearToken } from "../services/api";
import { mapApplication } from "../utils/downloadHelpers";
import { disconnectSocket } from "../services/socket";

const url = "https://studentnjalabackend.onrender.com";

const StudentContext = createContext(null);

function mapUserToStudent(user) {
  return {
    id: user._id,
    studentId: user.matricNumber,
    fullName: user.name,
    email: user.email,
    phone: user.phone || "",
    yearLevel: user.level || "Year 1",
    department: user.department || "BSc Nursing",
    profileImage: user.profileImage,
  };
}

function getErrorMessage(error, fallback) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ERR_NETWORK") {
    return "Cannot reach the server. Start the backend (npm run dev in /backend) and try again.";
  }
  return error.message || fallback;
}

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshApplications = useCallback(async () => {
    const token = localStorage.getItem("nunap_token");
    if (!token) {
      setApplications([]);
      return;
    }

    try {
      const response = await applicationsAPI.mine();
      setApplications((response.data.data || []).map(mapApplication));
    } catch {
      setApplications([]);
    }
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("nunap_token");
      if (!token) {
        clearStudent();
        setStudent(null);
        setApplications([]);
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.me();
        const user = response.data.user;
        if (user?.role !== "student") {
          if (user?.role === "admin") {
            setStudent(null);
            setApplications([]);
            setLoading(false);
            return;
          }
          clearToken();
          clearStudent();
          setStudent(null);
          setApplications([]);
          return;
        }

        const restoredStudent = mapUserToStudent(user);
        saveStudent(restoredStudent);
        setStudent(restoredStudent);
        await refreshApplications();
      } catch {
        clearToken();
        clearStudent();
        setStudent(null);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [refreshApplications]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({
        email: email.trim().toLowerCase(),
        password,
      });
      const user = response.data.user;

      if (user.role !== "student") {
        throw new Error("This account is not a student account. Use the admin login page instead.");
      }

      const savedStudent = mapUserToStudent(user);
      saveToken(response.data.token);
      saveStudent(savedStudent);
      setStudent(savedStudent);
      await refreshApplications();
      return savedStudent;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Invalid email or password."));
    }
  };

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      const user = response.data.user;
      const savedStudent = mapUserToStudent(user);
      saveToken(response.data.token);
      saveStudent(savedStudent);
      setStudent(savedStudent);
      await refreshApplications();
      return savedStudent;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Registration failed."));
    }
  };

  const logout = () => {
    disconnectSocket();
    clearToken();
    clearStudent();
    setStudent(null);
    setApplications([]);
  };

  const submitApplication = async (application) => {
    try {
      await applicationsAPI.create({
        hospitalId: application.hospitalId,
        department: application.department,
        preferredStartDate: application.preferredStartDate,
        reason: application.reason,
      });
      await refreshApplications();
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Could not submit clinical application.")
      );
    }
  };

  const checkPending = (hospitalId) => {
    if (!student || !hospitalId) return false;
    const id = String(hospitalId);
    return applications.some(
      (app) => String(app.hospitalId) === id && app.status === "Pending"
    );
  };

  const refreshProfile = async () => {
    const response = await authAPI.me();
    const user = response.data.user;
    if (user?.role !== "student") return null;
    const updated = mapUserToStudent(user);
    saveStudent(updated);
    setStudent(updated);
    return updated;
  };

  const updateProfile = async (data) => {
    try {
      await authAPI.updateProfile(data);
      return await refreshProfile();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Could not save profile."));
    }
  };

  const uploadProfilePhoto = async (file) => {
    try {
      await authAPI.uploadProfilePhoto(file);
      return await refreshProfile();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Could not upload photo."));
    }
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        applications,
        loading,
        login,
        register,
        logout,
        submitApplication,
        checkPending,
        refreshApplications,
        refreshProfile,
        updateProfile,
        uploadProfilePhoto,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within StudentProvider");
  }
  return context;
}
