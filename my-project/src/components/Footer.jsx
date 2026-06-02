import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaWhatsapp, FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative mt-20 text-white bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        
        {/* Brand */}
        <div>
          <h1 className="text-xl font-bold leading-snug">
            Njala University Nurses Association
          </h1>
          <p className="text-sm text-blue-100 mt-3">
            Empowering nursing students with modern learning & clinical tools.
          </p>
        </div>

        {/* Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-blue-100">
            {["Home", "Modules", "Placement", "Announcements", "Contact"].map(
              (item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6, color: "#ffffff" }}
                  className="cursor-pointer transition"
                >
                  {item}
                </motion.li>
              )
            )}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Subscribe</h2>
          <p className="text-sm text-blue-100 mb-3">
            Get latest updates in your inbox.
          </p>

          <div className="flex items-center bg-white/10 rounded-xl overflow-hidden border border-white/20">
            <input
              type="email"
              placeholder="Enter email..."
              className="w-full px-3 py-2 bg-transparent outline-none text-white"
            />
            <button className="px-4 py-2 bg-white text-blue-700 font-semibold hover:bg-blue-100 transition">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Social icons */}
        <div className="flex gap-4 text-xl">
          {[FaFacebook, FaInstagram, FaWhatsapp].map((Icon, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <Icon />
            </motion.div>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-sm text-blue-100 text-center">
          © {new Date().getFullYear()} Njala University Nurses Association. All rights reserved.
        </p>

        {/* Back to top */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={scrollTop}
          className="p-3 rounded-full bg-white text-blue-700 hover:bg-blue-100 transition shadow-lg"
        >
          <FaArrowUp />
        </motion.button>
      </div>
    </motion.footer>
  );
};

export default Footer;