import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ListChecks,
  Megaphone,
  LogOut,
} from "lucide-react";

import { useAdmin } from "../context/AdminContext";
import { useContent } from "../hooks/useContent";
import { applicationsAPI } from "../services/api";
import AdminAnnouncements from "../components/AdminAnnouncements";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, logout } = useAdmin();
  const { modules, timetables } = useContent();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsMessage, setAppsMessage] = useState("");

  const loadApplications = useCallback(async () => {
    setAppsLoading(true);
    setAppsMessage("");
    try {
      const res = await applicationsAPI.getAll();
      setApplications(res.data.data || []);
    } catch (err) {
      setAppsMessage(
        err.response?.data?.message || "Could not load applications"
      );
    } finally {
      setAppsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "applications") {
      loadApplications();
    }
  }, [activeTab, loadApplications]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleStatusChange = async (id, status) => {
    try {
      await applicationsAPI.updateStatus(id, { status });
      setAppsMessage(`Application marked as ${status}.`);
      await loadApplications();
    } catch (err) {
      setAppsMessage(
        err.response?.data?.message || "Could not update application status"
      );
    }
  };

  const stats = [
    { title: "Modules", value: modules.length },
    { title: "Timetables", value: timetables.length },
    { title: "Applications", value: applications.length },
    { title: "Admin", value: admin?.email ? 1 : 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-blue-900 text-white p-5">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-2">
          <TabButton
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            icon={LayoutDashboard}
            label="Dashboard"
          />
          <TabButton
            active={activeTab === "announcements"}
            onClick={() => setActiveTab("announcements")}
            icon={Megaphone}
            label="Announcements"
          />
          <TabButton
            active={activeTab === "modules"}
            onClick={() => setActiveTab("modules")}
            icon={BookOpen}
            label="Modules"
          />
          <TabButton
            active={activeTab === "timetables"}
            onClick={() => setActiveTab("timetables")}
            icon={CalendarDays}
            label="Timetables"
          />
          <TabButton
            active={activeTab === "applications"}
            onClick={() => setActiveTab("applications")}
            icon={ListChecks}
            label="Applications"
          />
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-3 bg-red-600 px-4 py-3 rounded-lg hover:bg-red-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Admin</h1>
          <p className="text-gray-500">{admin?.email}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          {stats.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-5">
              <h3 className="text-gray-500 text-sm">{item.title}</h3>
              <p className="text-3xl font-bold text-blue-700 mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
            <p className="text-gray-600">
              Publish announcements, review clinical posting applications, and
              manage academic content.
            </p>
          </div>
        )}

        {activeTab === "announcements" && <AdminAnnouncements />}

        {activeTab === "modules" && (
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Modules</h2>
            <ul className="space-y-3">
              {modules.map((module) => (
                <li key={module.id} className="border rounded-lg p-3">
                  {module.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "timetables" && (
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Timetables</h2>
            <ul className="space-y-3">
              {timetables.map((item) => (
                <li key={item.id} className="border rounded-lg p-3">
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">
              Student clinical applications
            </h2>
            {appsMessage && (
              <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg mb-4">
                {appsMessage}
              </p>
            )}
            {appsLoading ? (
              <p className="text-gray-500">Loading applications...</p>
            ) : applications.length === 0 ? (
              <p>No applications submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="border rounded-lg p-4">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">
                          {app.student?.name || "Student"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {app.student?.matricNumber} · {app.student?.email}
                        </p>
                        <p className="mt-2">
                          <strong>{app.hospital?.hospital}</strong> —{" "}
                          {app.hospital?.location}
                        </p>
                        <p className="text-sm text-gray-600">
                          {app.department} · Start{" "}
                          {new Date(app.preferredStartDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {app.reason}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-center px-3 py-1 rounded-full bg-gray-100">
                          {app.status}
                        </span>
                        {app.status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(app._id, "Approved")
                              }
                              className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(app._id, "Rejected")
                              }
                              className="text-sm bg-red-600 text-white px-3 py-1.5 rounded-lg"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg ${
        active ? "bg-blue-800" : "hover:bg-blue-800"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}
