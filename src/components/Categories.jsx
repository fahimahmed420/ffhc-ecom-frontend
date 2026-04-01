"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Categories() {
  const categories = [
    { name: "Electronics", img: "/categories/Electronics.jpg" },
    { name: "Fashion", img: "/categories/Fashion.jpg" },
    { name: "Home & Living", img: "/categories/Home.jpg" },
    { name: "Beauty", img: "/categories/Beauty.jpg" },
    { name: "Sports", img: "/categories/Sports.jpg" },
    { name: "Automotive", img: "/categories/Automotive.jpg" },
    { name: "Gaming", img: "/categories/Gaming.jpg" },
    { name: "Grocery", img: "/categories/Grocery.jpg" },
    { name: "Books", img: "/categories/Books.jpg" },
  ];

  return (
    <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">

      {/* Heading (same style as your section) */}
      <h2 className="text-2xl mb-12 text-center font-semibold">
        Browse Categories
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="group relative h-[180px] md:h-[220px] overflow-hidden cursor-pointer border border-gray-200 bg-white"
          >
            <Image
              src={cat.img}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

            {/* Title */}
            <p className="absolute bottom-4 left-4 text-white text-xs tracking-widest">
              {cat.name.toUpperCase()}
            </p>

            {/* Bottom hover line (same vibe as your cards) */}
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </motion.div>
        ))}
      </div>

    </section>
  );
}