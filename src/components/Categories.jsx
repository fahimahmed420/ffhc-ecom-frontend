"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Men", image: "/categories/cat1.png", slug: "men" },
  { name: "Women", image: "/categories/cat2.png", slug: "women" },
  { name: "Kids", image: "/categories/cat3.png", slug: "kids" },
  { name: "Shoes", image: "/categories/cat4.png", slug: "shoes" },
  { name: "Accessories", image: "/categories/cat5.png", slug: "accessories" },
  { name: "Bags", image: "/categories/cat6.png", slug: "bags" },
  { name: "Watches", image: "/categories/cat7.png", slug: "watches" },
  { name: "Beauty", image: "/categories/cat8.png", slug: "beauty" },
  { name: "Electronics", image: "/categories/cat9.png", slug: "electronics" },
];

export default function Categories() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-10">
        Shop by Category
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/category/${cat.slug}`)}
            className="relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-lg group"
          >
            {/* Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Name at bottom */}
            <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-md text-center py-2">
              <h3 className="text-white font-semibold">{cat.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}