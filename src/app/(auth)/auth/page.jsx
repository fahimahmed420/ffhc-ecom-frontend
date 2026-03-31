"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("from") || "/";

  // ✅ TEMP Google handler (UI only)
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    router.push("/"); // fake redirect
  };

  const validate = () => {
    let newErrors = {};

    if (!form.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }

    if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }

    if (!isLogin) {
      if (!form.name.trim()) newErrors.name = "Name required";
      if (form.password !== form.confirm)
        newErrors.confirm = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push(redirectPath);
    }, 1000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      
      {/* 🔙 Back to Home */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-20 px-4 py-2 text-xs tracking-widest border border-white/40 backdrop-blur-md hover:bg-white hover:text-black transition"
      >
        ← HOME
      </button>

      {/* 🖼️ Background */}
      <Image
        src="/a.jpg"
        alt="Auth Background"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-2xl shadow-xl"
        >
          {/* Toggle */}
          <div className="flex mb-6 text-sm tracking-widest border border-white/20 rounded overflow-hidden">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-3 transition ${
                isLogin ? "bg-white text-black" : "text-white/70"
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-3 transition ${
                !isLogin ? "bg-white text-black" : "text-white/70"
              }`}
            >
              SIGN UP
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    className="input"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <p className="error">{errors.name}</p>}
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder="EMAIL"
                  className="input"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="PASSWORD"
                  className="input"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <input
                    type="password"
                    placeholder="CONFIRM PASSWORD"
                    className="input"
                    onChange={(e) =>
                      setForm({ ...form, confirm: e.target.value })
                    }
                  />
                  {errors.confirm && <p className="error">{errors.confirm}</p>}
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 border border-white tracking-widest hover:bg-white hover:text-black transition"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" size={18} />
                ) : isLogin ? (
                  "LOGIN"
                ) : (
                  "CREATE ACCOUNT"
                )}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-xs text-white/60">OR</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 border border-white/30 hover:bg-white hover:text-black transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="tracking-widest text-sm">
                  CONTINUE WITH GOOGLE
                </span>
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Footer */}
          <p className="text-xs mt-6 text-white/60 text-center">
            {isLogin ? "DON’T HAVE AN ACCOUNT?" : "ALREADY HAVE AN ACCOUNT?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="underline cursor-pointer hover:text-white"
            >
              {isLogin ? "SIGN UP" : "LOGIN"}
            </span>
          </p>
        </motion.div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 12px;
          color: white;
          outline: none;
        }
        .input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .input:focus {
          border-color: white;
        }
        .error {
          font-size: 12px;
          color: #fca5a5;
          margin-top: 4px;
        }
      `}</style>
    </section>
  );
}