"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Home,
  Store,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path ? "text-black font-semibold" : "text-gray-500";

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
      <nav className="w-full border-b border-gray-300 bg-white hidden md:block">
        <div className=" px-6 py-4 flex items-center justify-between">
          
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full"></div>
            <span className="font-bold text-lg">FFHC</span>
          </div>

          {/* MIDDLE */}
          <div className="flex gap-10 text-sm font-medium">
            <Link href="/" className={isActive("/")}>
              Home
            </Link>
            <Link href="/shop" className={isActive("/shop")}>
              Shop
            </Link>
            <Link href="/new" className={isActive("/new")}>
              New
            </Link>
            <Link href="/blogs" className={isActive("/blogs")}>
              Blogs
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <Search className="w-5 h-5 cursor-pointer" />
            <ShoppingCart className="w-5 h-5 cursor-pointer" />
            <Heart className="w-5 h-5 cursor-pointer" />
            <User className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 md:hidden z-50">
        <div className="flex justify-around items-center py-3 text-xs">

          <Link href="/" className="flex flex-col items-center">
            <Home className={`w-5 h-5 ${isActive("/")}`} />
            <span className={isActive("/")}>Home</span>
          </Link>

          <Link href="/shop" className="flex flex-col items-center">
            <Store className={`w-5 h-5 ${isActive("/shop")}`} />
            <span className={isActive("/shop")}>Shop</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center">
            <ShoppingCart className={`w-6 h-6 ${isActive("/cart")}`} />
            <span className={isActive("/cart")}>Cart</span>
          </Link>

          <Link href="/wishlist" className="flex flex-col items-center">
            <Heart className={`w-5 h-5 ${isActive("/wishlist")}`} />
            <span className={isActive("/wishlist")}>Wishlist</span>
          </Link>

          <Link href="/account" className="flex flex-col items-center">
            <User className={`w-5 h-5 ${isActive("/account")}`} />
            <span className={isActive("/account")}>Account</span>
          </Link>

        </div>
      </div>
    </>
  );
}