"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase.config";

export default function ProfileSheet({ open, setOpen }) {
  const router = useRouter();
  const { user, role } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    router.push("/auth");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* SHEET */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-t-3xl shadow-2xl p-6">

              {/* HANDLE */}
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

              {/* PROFILE HEADER */}
              <div className="flex flex-col items-center text-center mb-6">
                
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-black to-gray-600 flex items-center justify-center text-white text-lg font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>

                <p className="mt-3 text-sm font-medium">{user?.email}</p>

                <p className="text-[10px] tracking-widest text-gray-400 uppercase">
                  {role || "user"}
                </p>
              </div>

              {/* ACTION CARDS */}
              <div className="space-y-3">

                {/* Dashboard */}
                <button
                  onClick={() => {
                    router.push("/dashboard");
                    setOpen(false);
                  }}
                  className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <LayoutDashboard size={16} />
                  </div>
                  <span className="text-sm font-medium">Dashboard</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 transition"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm">
                    <LogOut size={16} />
                  </div>
                  <span className="text-sm font-medium text-red-600">
                    Logout
                  </span>
                </button>

              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setOpen(false)}
                className="mt-6 w-full text-xs tracking-widest text-gray-400 hover:text-black transition"
              >
                TAP TO CLOSE
              </button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}