"use client";

import { FaTruck, FaHandshake, FaBoxOpen, FaShieldAlt } from "react-icons/fa";

const focusPoints = [
  {
    title: "China Direct Purchase",
    description: "We collect quality products directly from trusted suppliers in China",
    icon: <FaBoxOpen size={30} />,
    color: "bg-blue-500",
  },
  {
    title: "Secure Payment & Customer Trust",
    description: "Your payment is protected with secure and trusted systems, and your satisfaction is our top priority",
    icon: <FaShieldAlt size={30} />,
    color: "bg-green-500",
  },
  {
    title: "Fast Delivery",
    description: "We provide fast and reliable delivery to bring your products on time",
    icon: <FaTruck size={30} />,
    color: "bg-yellow-500",
  },
  {
    title: "Easy Return Policy",
    description: "If there is any problem with the product, we offer an easy return or support process",
    icon: <FaHandshake size={30} />,
    color: "bg-purple-500",
  },
];

export default function OurFocus() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
        Our Focus – What We Care About
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {focusPoints.map((point, idx) => (
          <div
            key={idx}
            className="flex flex-col items-start gap-4 p-6 rounded-xl shadow-lg hover:shadow-xl transition bg-white"
          >
            <div className={`w-12 h-12 flex items-center justify-center text-white rounded-full ${point.color}`}>
              {point.icon}
            </div>
            <h3 className="text-lg font-bold">{point.title}</h3>
            <p className="text-gray-600">{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}