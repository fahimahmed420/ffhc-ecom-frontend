"use client";

import { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,FaCcVisa,FaCcMastercard,FaCcPaypal,FaCcStripe   } from "react-icons/fa";

const supportLinks = [
  { title: "Privacy Policy", content: "Our privacy policy ensures your data is safe..." },
  { title: "Terms & Conditions", content: "These are the rules and guidelines for using our site..." },
  { title: "Shipping", content: "We provide fast and reliable shipping..." },
  { title: "Returns", content: "Easy return process if you are not satisfied..." },
];

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const openModal = (link) => {
    setModalContent(link);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <footer className="bg-gray-900 text-gray-300 relative z-10 py-8">
      <div className="max-w-7xl mx-auto px-6  grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo / Brand */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white">Family Fashion Hub China</h1>
          <p className="text-gray-400">Quality products, fast delivery, and reliable service.</p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Quick shop */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white mb-2">Quick Shop</h3>
          <a href="#" className="hover:text-white transition">Men</a>
          <a href="#" className="hover:text-white transition">Women</a>
          <a href="#" className="hover:text-white transition">Beauty</a>
          <a href="#" className="hover:text-white transition">Electronics</a>
          <a href="#" className="hover:text-white transition">Kids</a>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white mb-2">Support</h3>
          {supportLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => openModal(link)}
              className="text-left hover:text-white transition"
            >
              {link.title}
            </button>
          ))}
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white mb-2">Subscribe</h3>
          <p className="text-gray-400">Get the latest updates and offers.</p>
          <div className="mt-2 flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-md text-gray-900 focus:outline-none"
            />
            <button className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom copyright + payment */}
      <div className="max-w-7xl mx-auto mt-6 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <div>&copy; {new Date().getFullYear()} Family Fashion Hub. All rights reserved.</div>
        <div className="flex gap-4 mt-2 md:mt-0 text-white text-xl">
          <FaCcVisa />
          <FaCcMastercard />
          <FaCcPaypal />
          <FaCcStripe />
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl max-w-md p-6 text-gray-900 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">{modalContent.title}</h3>
            <p className="mb-6">{modalContent.content}</p>
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}