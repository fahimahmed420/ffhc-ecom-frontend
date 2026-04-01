"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 flex items-center justify-center min-h-[70vh]">

      <div className="text-center border border-gray-200 p-10 md:p-16 bg-white">

        {/* Error Code */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl tracking-widest uppercase mb-6"
        >
          404
        </motion.h1>

        {/* Title */}
        <h2 className="text-sm tracking-widest uppercase mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <Link href="/">
          <button className="border border-black px-6 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition">
            Go Home
          </button>
        </Link>

      </div>

    </section>
  );
}