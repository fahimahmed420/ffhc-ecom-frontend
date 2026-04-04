"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Package,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ Listen to auth state & fetch role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const res = await fetch(`/api/users?email=${currentUser.email}`);
          const data = await res.json();
          setRole(data?.role || "user");
        } catch (err) {
          console.error("Failed to fetch role:", err);
          setRole("user");
        }
      } else {
        setRole(null);
      }

      setAuthLoading(false); // ✅ done loading
    });

    return () => unsubscribe();
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    router.push("/auth");
  };

  // ✅ Navigation items with role check
  const navItems = [
    { name: "HOME", path: "/", icon: <Home size={14} /> },
    ...(role === "admin"
      ? [
          {
            name: "MANAGE PRODUCT",
            path: "/dashboard/add-product",
            icon: <Package size={14} />,
          },
        ]
      : []),
    {
      name: "ORDERS",
      path: "/dashboard/orders",
      icon: <ClipboardList size={14} />,
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm tracking-widest uppercase">Authenticating...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Navbar */}
      <nav className="border-b border-gray-300 px-6 md:px-12 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/dashboard">
          <h1 className="tracking-[0.2em] cursor-pointer">FFHC</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[11px] tracking-widest">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`relative group flex items-center gap-2 ${
                  isActive ? "text-black" : "text-gray-500"
                }`}
              >
                {item.icon}
                {item.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[1px] bg-black transition-all ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}

          {/* Auth Section */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 hover:text-black cursor-pointer"
                >
                  <User size={14} />
                  ACCOUNT
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-40 bg-white border border-gray-200 shadow-sm text-[11px] tracking-widest">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      <User size={14} />
                      PROFILE
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-left"
                    >
                      <LogOut size={14} />
                      LOGOUT
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => router.push("/auth")}
                className="flex items-center gap-2 hover:text-black"
              >
                <User size={14} />
                LOGIN
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Menu
            size={18}
            className="cursor-pointer"
            onClick={() => setMobileMenu(true)}
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-white z-50 p-6 flex flex-col">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="tracking-[0.2em]">FFHC</h1>
            <X
              size={20}
              className="cursor-pointer"
              onClick={() => setMobileMenu(false)}
            />
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6 text-[12px] tracking-widest">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setMobileMenu(false)}
                  className={`${isActive ? "text-black" : "text-gray-500"} flex items-center gap-2`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}

            {user ? (
              <>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <User size={14} />
                  PROFILE
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-left text-gray-500"
                >
                  <LogOut size={14} />
                  LOGOUT
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/auth")}
                className="flex items-center gap-2 text-gray-500"
              >
                <User size={14} />
                LOGIN
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 p-6 md:p-10 bg-white">{children}</main>
    </div>
  );
}
