"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Summer Collection",
    subtitle: "Discover the latest trends",
    image: "/h1.png",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh styles just dropped",
    image: "/h2.png",
  },
  {
    title: "Limited Edition",
    subtitle: "Grab before it's gone",
    image: "/h3.png",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Swipe support
  const handleDragEnd = (e, info) => {
    if (info.offset.x > 100) {
      setCurrent((prev) =>
        prev === 0 ? slides.length - 1 : prev - 1
      );
    } else if (info.offset.x < -100) {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <section className="w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        <div className="relative h-[420px] md:h-[520px] rounded-2xl overflow-hidden">

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              drag="x"
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
            >
              {/* MOBILE BACKGROUND */}
              <div
                className="absolute inset-0 md:hidden bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slides[current].image})`,
                }}
              >
                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              </div>

              {/* DESKTOP IMAGE */}
              <div className="hidden md:block absolute right-0 top-0 w-1/2 h-full">
                <img
                  src={slides[current].image}
                  alt="hero"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* TEXT CONTENT */}
              <div className="relative z-10 h-full flex items-center ml-4">
                <div className="w-full md:w-1/2 text-white md:text-black">

                  {/* Animated Text */}
                  <motion.h1
                    key={slides[current].title}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl font-bold mb-4"
                  >
                    {slides[current].title}
                  </motion.h1>

                  <motion.p
                    key={slides[current].subtitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-6 opacity-90 md:opacity-100"
                  >
                    {slides[current].subtitle}
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="px-6 py-3 bg-white text-black md:bg-black md:text-white rounded-lg hover:scale-105 transition"
                  >
                    Browse
                  </motion.button>

                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* DOTS */}
        <div className="flex gap-2 mt-6">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                current === index
                  ? "bg-black scale-125"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}