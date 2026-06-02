import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStudent } from "../context/StudentContext";
import { useAdmin } from "../context/AdminContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { student, logout } = useStudent();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold"
      : "text-gray-700 hover:text-blue-500";

  return (
    <nav className="w-full shadow-md bg-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <NavLink to="/" className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.png"
              alt="Njala University Nurses Association"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs sm:text-sm font-bold text-blue-600">
                Njala University
              </span>
              <span className="text-xs sm:text-sm font-semibold text-blue-700">
                Nurses Association
              </span>
            </div>
          </NavLink>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink to="/" className={linkStyle}>Home</NavLink>
          <NavLink to="/placements" className={linkStyle}>Placements</NavLink>
          <NavLink to="/apply" className={linkStyle}>Apply for Posting</NavLink>

          {student && (
            <>
              <NavLink to="/my-applications" className={linkStyle}>
                My Applications
              </NavLink>
              <NavLink to="/chat" className={linkStyle}>
                Chat
              </NavLink>
              <NavLink to="/student-id" className={linkStyle}>
                Profile & ID
              </NavLink>
            </>
          )}

          <NavLink to="/modules" className={linkStyle}>Modules</NavLink>
          <NavLink to="/announcement" className={linkStyle}>Announcements</NavLink>
          <NavLink to="/contact" className={linkStyle}>Contact</NavLink>

          <NavLink
            to={isAdmin ? "/admin/dashboard" : "/admin/login"}
            className="text-xs font-medium text-gray-500 hover:text-gray-800 border-l pl-4 ml-1"
          >
            {isAdmin ? "Admin panel" : "Admin"}
          </NavLink>

          {student ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden lg:inline">
                {student.fullName.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-sm text-gray-600 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/register"
                className="text-sm text-blue-600 hover:underline"
              >
                Register
              </NavLink>

              <NavLink
                to="/login"
                className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden bg-white px-4 pb-4 flex flex-col gap-3"
        >
          <NavLink onClick={() => setIsOpen(false)} to="/" className={linkStyle}>Home</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/placements" className={linkStyle}>Placements</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/apply" className={linkStyle}>Apply for Posting</NavLink>

          {student && (
            <>
              <NavLink onClick={() => setIsOpen(false)} to="/my-applications" className={linkStyle}>
                My Applications
              </NavLink>
              <NavLink onClick={() => setIsOpen(false)} to="/chat" className={linkStyle}>
                Chat
              </NavLink>
              <NavLink onClick={() => setIsOpen(false)} to="/student-id" className={linkStyle}>
                Profile & ID
              </NavLink>
            </>
          )}

          <NavLink onClick={() => setIsOpen(false)} to="/modules" className={linkStyle}>Modules</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/announcement" className={linkStyle}>Announcements</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/contact" className={linkStyle}>Contact</NavLink>

          <NavLink
            onClick={() => setIsOpen(false)}
            to={isAdmin ? "/admin/dashboard" : "/admin/login"}
            className={linkStyle}
          >
            {isAdmin ? "Admin panel" : "Admin login"}
          </NavLink>

          {student ? (
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate("/");
              }}
              className="text-left text-red-600"
            >
              Logout ({student.fullName})
            </button>
          ) : (
            <>
              <NavLink
                onClick={() => setIsOpen(false)}
                to="/register"
                className={linkStyle}
              >
                Register
              </NavLink>

              <NavLink
                onClick={() => setIsOpen(false)}
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
              >
                Login
              </NavLink>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;