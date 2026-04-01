"use client";

import { motion } from "framer-motion";
import { FaTruck, FaHandshake, FaBoxOpen, FaShieldAlt } from "react-icons/fa";

const focusPoints = [
  {
    title: "China Direct Purchase",
    description:
      "We collect quality products directly from trusted suppliers in China",
    icon: <FaBoxOpen size={18} />,
  },
  {
    title: "Secure Payment & Customer Trust",
    description:
      "Your payment is protected with secure systems and your satisfaction is our priority",
    icon: <FaShieldAlt size={18} />,
  },
  {
    title: "Fast Delivery",
    description:
      "We provide fast and reliable delivery to bring your products on time",
    icon: <FaTruck size={18} />,
  },
  {
    title: "Easy Return Policy",
    description:
      "If there is any problem, we offer an easy return or support process",
    icon: <FaHandshake size={18} />,
  },
];

export default function OurFocus() {
  return (
    <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
      
      {/* Heading (same style as other sections) */}
      <h2 className="text-2xl mb-12 text-center font-semibold">
        Our Focus
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {focusPoints.map((point, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="group border border-gray-200 p-6 bg-white cursor-pointer relative"
          >
            {/* Icon */}
            <div className="mb-6 text-gray-600 opacity-80">
              {point.icon}
            </div>

            {/* Title */}
            <h3 className="text-sm tracking-widest mb-2">
              {point.title.toUpperCase()}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed">
              {point.description}
            </p>

            {/* Hover underline */}
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}