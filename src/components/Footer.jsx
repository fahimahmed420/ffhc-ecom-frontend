"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const links = [
    {
      title: "Privacy Policy",
      description:
        "We respect your privacy and ensure that your personal data is securely handled and never shared without consent.",
    },
    {
      title: "Terms of Service",
      description:
        "By using our platform, you agree to our terms and conditions designed to ensure a fair experience for all users.",
    },
    {
      title: "Shipping Info",
      description:
        "We provide fast and reliable shipping with tracking support so you always know where your order is.",
    },
    {
      title: "Contact Us",
      description:
        "Need help? Our support team is always ready to assist you with any questions or concerns.",
    },
  ];

  const payments = ["Visa", "Mastercard", "bKash", "Nagad", "Rocket"];

  return (
    <footer className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
      
      {/* Brand */}
      <h2 className="text-2xl mb-6 text-center">
        Family Fashion Hub China
      </h2>

      {/* Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
        {links.map((link, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => setActiveModal(link)}
            className="group border border-gray-200 p-6 bg-white cursor-pointer relative text-center"
          >
            <h3 className="text-sm tracking-widest">
              {link.title.toUpperCase()}
            </h3>

            {/* Hover underline */}
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></div>
          </motion.div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="text-center mb-8">
        <p className="text-sm tracking-widest mb-3">
          ACCEPTED PAYMENTS
        </p>
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-500">
          {payments.map((method, idx) => (
            <span key={idx} className="border px-3 py-1">
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <p className="text-sm text-gray-500 text-center">
        © 2026 Family Fashion Hub China. All rights reserved.
      </p>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
            />

            {/* Modal Box */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 px-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-white max-w-md w-full p-8 border border-gray-200 relative">
                
                {/* Title */}
                <h3 className="text-sm tracking-widest mb-4">
                  {activeModal.title.toUpperCase()}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {activeModal.description}
                </p>

                {/* Close */}
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-3 right-4 text-gray-400 hover:text-black"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </footer>
  );
}