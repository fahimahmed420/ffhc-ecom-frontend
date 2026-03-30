"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative h-[90vh] overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="/hero-image.jpg"
        fill
        priority
        className="object-cover"
        alt="Hero"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl p-6 md:p-12 w-[90%] md:w-[520px]"
      >
        {/* Title */}
        <h1 className="text-4xl md:text-5xl text-white mb-4 tracking-tight md:tracking-normal">
          The Art of Simplicity.
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base text-white/80 mb-8 leading-relaxed">
          Discover carefully curated pieces that blend minimal design with
          everyday functionality — crafted to elevate your lifestyle with
          effortless elegance.
        </p>

        {/* Buttons (animated separately) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <button
            onClick={() => router.push("/collections")}
            className="bg-black text-white px-6 py-3 tracking-widest text-sm hover:bg-white hover:text-black transition"
          >
            SHOP COLLECTION
          </button>

          <button
            onClick={() => router.push("/collections")}
            className="text-white border-b text-sm tracking-widest hover:opacity-70 transition"
          >
            VIEW LOOKBOOK
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xs tracking-widest opacity-80">
        SCROLL
      </div>
    </section>
  );
}