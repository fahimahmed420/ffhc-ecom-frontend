"use client";

import { useState, useRef, useEffect } from "react";
import { ShoppingBag, Search, User, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

//  import auth
import { logoutUser } from "@/lib/firebase/auth";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();
  const { cart } = useCart();
  const { user } = useAuth();

  const dropdownRef = useRef(null);

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "COLLECTIONS", path: "/collections" },
    { name: "ABOUT", path: "/about" },
  ];

  // 🔍 Search
  const handleSearch = async () => {
    if (!query.trim()) return;
    router.push(`/collections?search=${query}`);
    await fetch(`https://dummyjson.com/products/search?q=${query}`);
  };

  // 🔓 Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      setDropdownOpen(false);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* 🔍 Search */}
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

        {showSearch ? (
          <X size={16} className="cursor-pointer" onClick={() => setShowSearch(false)} />
        ) : (
          <Search
            size={16}
            className="cursor-pointer hover:scale-110 transition"
            onClick={() => setShowSearch(true)}
          />
        )}

        {/* Cart */}
        <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
          <ShoppingBag className="hover:scale-110 transition" size={16} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </div>

        {/* 👤 AUTH SECTION */}
        <div className="relative" ref={dropdownRef}>

          {!user ? (
            // 🔐 NOT LOGGED IN → SHOW LOGIN BUTTON
            <button
              onClick={() => router.push("/auth")}
              className="text-xs border px-3 py-1 hover:bg-black hover:text-white transition tracking-widest"
            >
              LOGIN
            </button>
          ) : (
            // 👤 LOGGED IN → USER ICON
            <div className="relative">
              <User
                size={16}
                className="cursor-pointer hover:scale-110 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-40 bg-white border shadow-md text-sm z-50"
                  >
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <Menu className="md:hidden cursor-pointer" onClick={() => setOpen(!open)} />
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
                <Link href={item.path} onClick={() => setOpen(false)}>
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