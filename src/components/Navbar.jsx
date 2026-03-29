"use client";

import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b px-6 md:px-12 py-4 flex justify-between items-center">

      <h1 className="tracking-[0.2em]">FFHC</h1>

      {/* Desktop */}
      <ul className="hidden md:flex gap-10 text-[11px] tracking-widest">
        {["COLLECTIONS", "NEW ARRIVALS", "STORES", "ABOUT"].map((item) => (
          <li key={item} className="relative group cursor-pointer">
            {item}
            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black transition-all group-hover:w-full"></span>
          </li>
        ))}
      </ul>

      {/* Icons */}
      <div className="flex gap-4 items-center">
        <Search size={16} className="cursor-pointer hover:scale-110 transition" />
        <ShoppingBag size={16} className="cursor-pointer hover:scale-110 transition" />
        <User size={16} className="cursor-pointer hover:scale-110 transition" />

        {/* Mobile menu */}
        <Menu
          className="md:hidden cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Mobile dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-0 w-full bg-white shadow-md p-6 md:hidden"
        >
          <ul className="space-y-4 text-sm">
            <li>Collections</li>
            <li>New Arrivals</li>
            <li>Stores</li>
            <li>About</li>
          </ul>
        </motion.div>
      )}
    </nav>
  );
}