"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    divisionId: "",
    divisionName: "",
    districtId: "",
    districtName: "",
    upazilaId: "",
    upazilaName: "",
    unionId: "",
    unionName: "",
    address: "",
  });

  // ================= CART =================
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  useEffect(() => {
    if (!cart.length) return;

    const ids = cart.map((i) => (typeof i === "string" ? i : i.id));

    fetch(`/api/products?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, [cart]);

  // ================= BD API =================
  useEffect(() => {
    fetch("https://bdapi.vercel.app/api/v.1/division")
      .then((res) => res.json())
      .then((data) => setDivisions(data.data || []));
  }, []);

  useEffect(() => {
    if (!form.divisionId) return;

    fetch(`https://bdapi.vercel.app/api/v.1/district/${form.divisionId}`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.data || []));
  }, [form.divisionId]);

  useEffect(() => {
    if (!form.districtId) return;

    fetch(`https://bdapi.vercel.app/api/v.1/upazilla/${form.districtId}`)
      .then((res) => res.json())
      .then((data) => setUpazilas(data.data || []));
  }, [form.districtId]);

  useEffect(() => {
    if (!form.upazilaId) return;

    fetch(`https://bdapi.vercel.app/api/v.1/union/${form.upazilaId}`)
      .then((res) => res.json())
      .then((data) => setUnions(data.data || []));
  }, [form.upazilaId]);

  // ================= CART HELPERS =================
  const getQty = (id) => {
    const item = cart.find((c) =>
      typeof c === "string" ? c === id : c.id === id
    );
    return typeof item === "string" ? 1 : item?.qty || 1;
  };

  const merged = products.map((p) => {
    const qty = getQty(p._id);

    const discountedPrice = p.discountPercentage
      ? (p.price * (100 - p.discountPercentage)) / 100
      : p.price;

    return { ...p, qty, discountedPrice };
  });

  const subtotal = merged.reduce(
    (acc, i) => acc + i.discountedPrice * i.qty,
    0
  );

  // ================= SHIPPING =================
  const isDhaka =
    form.districtName?.toLowerCase().includes("dhaka");

  const shipping = form.districtId
    ? isDhaka
      ? 60
      : 120
    : 0;

  const total = subtotal + shipping;

  // ================= ORDER =================
  const handleOrder = async () => {
    setLoading(true);

    const order = {
      items: merged,
      customer: form,
      subtotal,
      shipping,
      total,
      paymentMethod: "COD",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (data?.success) {
        alert("Order placed successfully! Invoice sent to email 📧");
        localStorage.removeItem("cart");
        window.location.href = "/";
      } else {
        alert(data?.message || "Order failed");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.name &&
    form.email &&
    form.phone &&
    form.divisionId &&
    form.districtId &&
    form.upazilaId &&
    form.address;

  // ================= UI =================
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">

      {/* LEFT FORM */}
      <div className="bg-white p-8 rounded-2xl shadow space-y-6">
        <h2 className="text-2xl font-semibold">
          Delivery Information
        </h2>

        {/* BASIC INFO */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Full Name"
            className="input"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            className="input"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            className="input"
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
        </div>

        {/* DIVISION */}
        <select
          className="input"
          onChange={(e) => {
            const selected = divisions.find(
              (d) => d.id === e.target.value
            );

            setForm({
              ...form,
              divisionId: selected?.id || "",
              divisionName: selected?.name || "",
              districtId: "",
              upazilaId: "",
              unionId: "",
            });

            setDistricts([]);
            setUpazilas([]);
            setUnions([]);
          }}
        >
          <option value="">Select Division</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* DISTRICT */}
        <select
          className="input"
          disabled={!districts.length}
          onChange={(e) => {
            const selected = districts.find(
              (d) => d.id === e.target.value
            );

            setForm({
              ...form,
              districtId: selected?.id || "",
              districtName: selected?.name || "",
              upazilaId: "",
              unionId: "",
            });

            setUpazilas([]);
            setUnions([]);
          }}
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* UPAZILA */}
        <select
          className="input"
          disabled={!upazilas.length}
          onChange={(e) => {
            const selected = upazilas.find(
              (u) => u.id === e.target.value
            );

            setForm({
              ...form,
              upazilaId: selected?.id || "",
              upazilaName: selected?.name || "",
              unionId: "",
            });

            setUnions([]);
          }}
        >
          <option value="">Select Upazila</option>
          {upazilas.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        {/* UNION */}
        <select
          className="input"
          disabled={!unions.length}
          onChange={(e) => {
            const selected = unions.find(
              (u) => u.id === e.target.value
            );

            setForm({
              ...form,
              unionId: selected?.id || "",
              unionName: selected?.name || "",
            });
          }}
        >
          <option value="">Select Union</option>
          {unions.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Full Address"
          className="input"
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        {/* PAYMENT INFO */}
        <div className="p-4 bg-yellow-50 border rounded-xl text-sm">
          💳 Online payment is currently unavailable.  
          Only <b>Cash on Delivery</b> is supported.
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>

        {merged.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span>
              {item.title} × {item.qty}
            </span>
            <span>
              ৳{(item.qty * item.discountedPrice).toFixed(0)}
            </span>
          </div>
        ))}

        <hr />

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>৳{subtotal.toFixed(0)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>৳{shipping}</span>
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>৳{total.toFixed(0)}</span>
        </div>

        <button
          disabled={!isValid || loading}
          onClick={handleOrder}
          className="w-full bg-black text-white py-3 rounded-xl disabled:bg-gray-300"
        >
          {loading ? "Placing Order..." : "Place Order (COD)"}
        </button>
      </div>
    </section>
  );
}