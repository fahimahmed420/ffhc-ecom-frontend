"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { FaStore, FaTruck } from "react-icons/fa"; // Icons for Retail / Wholesale

export default function PriceComparison({ retailPrice = 50, wholesalePrice = 35 }) {
  const savings = Math.round(((retailPrice - wholesalePrice) / retailPrice) * 100);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ count: savings });
  }, [controls, savings]);

  const options = [
    {
      title: "Retail Price",
      price: retailPrice,
      description: "Price for a single unit",
      icon: <FaStore size={24} />,
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      title: "Wholesale Price",
      price: wholesalePrice,
      description: "Bulk purchase discount",
      icon: <FaTruck size={24} />,
      color: "bg-gradient-to-br from-green-500 to-green-700",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 -z-10"></div>

      <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
        Compare Prices
      </h2>

      <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch">
        {options.map((opt, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={`relative rounded-xl p-6 text-white shadow-xl cursor-pointer flex-1 flex flex-col items-center ${opt.color} transition`}
          >
            {/* Icon */}
            <div className="mb-4">{opt.icon}</div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-2">{opt.title}</h3>

            {/* Price */}
            <p className="text-3xl font-extrabold mb-2">${opt.price}</p>

            {/* Description */}
            <p className="opacity-90 text-center">{opt.description}</p>

            {/* Savings badge for wholesale */}
            {opt.title === "Wholesale Price" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-3 right-3 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-semibold"
              >
                Save {savings}%
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}