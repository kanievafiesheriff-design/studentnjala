import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Placement from "./pages/Placement";
import HospitalDetail from "./pages/HospitalDetail";
import Module from "./pages/Module";
import Announcement from "./pages/Announcement";
import Contact from "./pages/Contact";
import ApplyForPosting from "./pages/ApplyForPosting";
import ApplyPosting from "./pages/ApplyPosting";
import MyApplications from "./pages/MyApplications";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import StudentRoute from "./components/StudentRoute";
import Chat from "./pages/Chat";
import StudentIdCard from "./pages/StudentIdCard";
import VerifyId from "./pages/VerifyId";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/placements" element={<Placement />} />
          <Route path="/placements/:id" element={<HospitalDetail />} />
          <Route path="/apply" element={<ApplyForPosting />} />
          <Route path="/apply/form" element={<ApplyPosting />} />
          <Route path="/apply/form/:hospitalId" element={<ApplyPosting />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/modules" element={<Module />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route
            path="/chat"
            element={
              <StudentRoute>
                <Chat />
              </StudentRoute>
            }
          />
          <Route
            path="/student-id"
            element={
              <StudentRoute>
                <StudentIdCard />
              </StudentRoute>
            }
          />
          <Route path="/verify-id/:code" element={<VerifyId />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>

      <Footer />
    </>
  );
}

export default App;