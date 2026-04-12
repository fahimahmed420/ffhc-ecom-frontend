"use client";

import { motion } from "framer-motion";

export default function AuthLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-md">
      
      <div className="flex flex-col items-center gap-6">
        
        {/* Logo / Brand */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.2em" }}
          transition={{ duration: 0.6 }}
          className="text-xl tracking-[0.2em] font-medium"
        >
          FFHC
        </motion.h1>

        {/* Animated Line */}
        <div className="w-40 h-[2px] bg-gray-200 overflow-hidden relative">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-1/2 h-full bg-black"
          />
        </div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-[10px] tracking-[0.3em] text-gray-500"
        >
          AUTHENTICATING
        </motion.p>

      </div>
    </div>
  );
}