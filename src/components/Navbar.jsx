"use client";

import { useState } from "react";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const router = useRouter();
  const { cart } = useCart();

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "COLLECTIONS", path: "/collections" },
    { name: "ABOUT", path: "/about" },
  ];

  // 🔍 Handle Search
  const handleSearch = async () => {
    if (!query.trim()) return;

    router.push(`/collections?search=${query}`);

    // optional API call (for logging/debug)
    await fetch(`https://dummyjson.com/products/search?q=${query}`);
  };

  return (
    <nav className="border-b border-gray-300 px-6 md:px-12 py-4 flex justify-between items-center relative">

      {/* Logo */}
      <Link href="/">
        <h1 className="tracking-[0.2em] cursor-pointer">FFHC</h1>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-10 text-[11px] tracking-widest">
        {navItems.map((item) => (
          <li key={item.name} className="relative group cursor-pointer">
            <Link href={item.path}>
              {item.name}
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black transition-all group-hover:w-full"></span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">

        {/* 🔍 Search Input */}
        <AnimatePresence>
          {showSearch && (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 180, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              type="text"
              placeholder="Search..."
              className="border px-3 py-1 text-sm outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          )}
        </AnimatePresence>

        {/* Search Icon */}
        {showSearch ? (
          <X
            size={16}
            className="cursor-pointer"
            onClick={() => setShowSearch(false)}
          />
        ) : (
          <Search
            size={16}
            className="cursor-pointer hover:scale-110 transition"
            onClick={() => setShowSearch(true)}
          />
        )}

        {/* Cart */}
        <div
          className="relative cursor-pointer"
          onClick={() => router.push("/cart")}
        >
          <ShoppingBag className="hover:scale-110 transition" size={16} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </div>

        {/* User */}
        <User
          size={16}
          className="cursor-pointer hover:scale-110 transition"
          onClick={() => router.push("/auth")}
        />

        {/* Mobile Menu */}
        <Menu
          className="md:hidden cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-0 w-full bg-white shadow-md p-6 md:hidden"
        >
          <ul className="space-y-4 text-sm">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className="block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </nav>
  );
}