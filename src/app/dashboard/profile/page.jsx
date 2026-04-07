"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    photo: "",
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  /* -------------------------
     LOAD USER + DRAFT
  -------------------------- */
  useEffect(() => {
    const draft = localStorage.getItem("profile-draft");
    if (draft) {
      setForm(JSON.parse(draft));
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const res = await fetch(`/api/users?email=${currentUser.email}`);
          const data = await res.json();

          setForm((prev) => ({
            name: data?.name || currentUser.displayName || prev.name,
            phone: data?.phone || prev.phone,
            address: data?.address || prev.address,
            photo: data?.photo || currentUser.photoURL || prev.photo,
          }));
        } catch (err) {
          console.error(err);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* -------------------------
     AUTO SAVE DRAFT
  -------------------------- */
  useEffect(() => {
    if (!isDirty) return;

    const timeout = setTimeout(() => {
      localStorage.setItem("profile-draft", JSON.stringify(form));
    }, 500);

    return () => clearTimeout(timeout);
  }, [form, isDirty]);

  /* -------------------------
     WARNING BEFORE LEAVE
  -------------------------- */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  /* -------------------------
     INPUT HANDLER
  -------------------------- */
  const handleChange = (e) => {
    setIsDirty(true);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* -------------------------
     IMAGE HANDLER (BASE64)
  -------------------------- */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setIsDirty(true);
      setForm((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  /* -------------------------
     SAVE PROFILE
  -------------------------- */
  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Update failed");

      setEditMode(false);
      setIsDirty(false);
      localStorage.removeItem("profile-draft");

      toast.success("Profile updated ");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------
     LOADING UI
  -------------------------- */
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 mx-auto mb-10 rounded" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="md:col-span-2 h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) return <p className="p-10 text-center">Not logged in</p>;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide uppercase">
          Profile
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Manage your personal information
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* AVATAR CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col items-center text-center">

          <div className="w-28 h-28 rounded-full overflow-hidden border mb-4 shadow">
            <img
              src={form.photo || user.photoURL || "/default.png"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-sm font-medium uppercase tracking-wider">
            {form.name || user.displayName}
          </h2>

          <p className="text-xs text-gray-500 mt-1 break-all">
            {user.email}
          </p>

          {editMode && (
            <label className="mt-4 text-xs cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition">
              Change Photo
              <input
                type="file"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* INFO CARD */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">

          <h3 className="text-xs uppercase tracking-widest text-gray-500">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">

            {/* Name */}
            <div>
              <label className="text-xs text-gray-400">Full Name</label>
              {editMode ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="mt-1">{form.name || "-"}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-400">Email</label>
              <p className="mt-1 break-all">{user.email}</p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs text-gray-400">Phone</label>
              {editMode ? (
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="mt-1">{form.phone || "-"}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="text-xs text-gray-400">Address</label>
              {editMode ? (
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="mt-1">{form.address || "-"}</p>
              )}
            </div>
          </div>

          {/* UNSAVED WARNING */}
          {isDirty && (
            <p className="text-xs text-orange-500">
              You have unsaved changes
            </p>
          )}

          {/* ACTIONS */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="w-full sm:w-auto cursor-pointer px-5 py-2 rounded-lg text-white border bg-black hover:bg-white hover:text-black transition"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="w-full sm:w-auto px-5 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto px-5 py-2 rounded-lg bg-black text-white flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}