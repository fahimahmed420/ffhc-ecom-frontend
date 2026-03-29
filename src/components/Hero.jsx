"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative h-[90vh]">
      <img src="/hero-image.jpg" className="w-full h-full object-cover" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl p-6 md:p-12 w-[90%] md:w-[520px]"
      >
        <h1 className="text-4xl md:text-5xl text-white mb-6">
          The Art of Simplicity.
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/collections")}
            className="bg-black text-white px-6 py-3 hover:bg-white hover:text-black transition"
          >
            SHOP COLLECTION
          </button>

          <button
            onClick={() => router.push("/collections")}
            className="text-white border-b"
          >
            VIEW LOOKBOOK
          </button>
        </div>
      </motion.div>
    </section>
  );
}