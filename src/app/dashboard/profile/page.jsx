"use client";

import { motion } from "framer-motion";

export default function ProfilePage() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">

      {/* Heading */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl tracking-widest uppercase mb-4"
        >
          Profile
        </motion.h1>

        <p className="text-sm text-gray-500">
          Manage your personal information
        </p>
      </div>

      {/* Profile Container */}
      <div className="grid md:grid-cols-3 gap-10">

        {/* Left - Avatar Card */}
        <div className="border border-gray-200 p-6 bg-white flex flex-col items-center text-center">
          <div className="w-24 h-24 border border-gray-300 rounded-full mb-4 overflow-hidden flex items-center justify-center bg-gray-50">
            {/* Replace with Image later if needed */}
            <span className="text-gray-400 text-sm">IMG</span>
          </div>

          <h2 className="text-sm tracking-widest uppercase mb-1">
            John Doe
          </h2>

          <p className="text-xs text-gray-500">
            johndoe@email.com
          </p>
        </div>

        {/* Right - Info Cards */}
        <div className="md:col-span-2 space-y-6">

          {/* Personal Info */}
          <div className="border border-gray-200 p-6 bg-white">
            <h3 className="text-sm tracking-widest uppercase mb-4">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase">Full Name</p>
                <p className="text-gray-700">John Doe</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase">Email</p>
                <p className="text-gray-700">johndoe@email.com</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase">Phone</p>
                <p className="text-gray-700">+880 123456789</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase">Location</p>
                <p className="text-gray-700">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="border border-gray-200 p-6 bg-white">
            <h3 className="text-sm tracking-widest uppercase mb-4">
              Account Settings
            </h3>

            <div className="space-y-3 text-sm">
              <button className="w-full border border-gray-300 px-4 py-2 text-left hover:bg-black hover:text-white transition">
                Edit Profile
              </button>

              <button className="w-full border border-gray-300 px-4 py-2 text-left hover:bg-black hover:text-white transition">
                Change Password
              </button>

              <button className="w-full border border-gray-300 px-4 py-2 text-left hover:bg-black hover:text-white transition">
                Manage Address
              </button>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}