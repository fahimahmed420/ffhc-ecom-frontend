"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD CART =================
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    if (cart.length === 0) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      const ids = cart.map((item) =>
        typeof item === "string" ? item : item.id,
      );

      const res = await fetch(`/api/products?ids=${ids.join(",")}`);
      const data = await res.json();

      setProducts(data.products || []);
      setLoading(false);
    };

    fetchProducts();
  }, [cart]);

  // ================= HELPERS =================
  const getQty = (id) => {
    const item = cart.find((c) =>
      typeof c === "string" ? c === id : c.id === id,
    );
    return typeof item === "string" ? 1 : item?.qty || 1;
  };

  const updateQty = (id, delta) => {
    const updated = cart.map((item) => {
      if (typeof item === "string") {
        if (item === id) return { id, qty: 1 + delta };
        return item;
      }

      if (item.id === id) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    });

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) =>
      typeof item === "string" ? item !== id : item.id !== id,
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ================= MERGE =================
  const merged = products.map((p) => {
    const qty = getQty(p._id);

    const discountedPrice = p.discountPercentage
      ? (p.price * (100 - p.discountPercentage)) / 100
      : p.price;

    return {
      ...p,
      qty,
      discountedPrice,
    };
  });

  // ================= TOTAL =================
  const subtotal = merged.reduce(
    (acc, item) => acc + item.discountedPrice * item.qty,
    0,
  );

  // ================= UI =================
  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        Loading your cart...
      </div>
    );
  }

  if (merged.length === 0) {
    return (
      <div className="py-28 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Your cart feels lonely 🛒
        </h2>
        <Link
          href="/collections"
          className="px-8 py-3 bg-black text-white rounded-full"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <h1 className="text-4xl font-semibold mb-12 tracking-tight">
        Shopping Cart
      </h1>

      <div className="grid md:grid-cols-3 gap-10">
        {/* ITEMS */}
        <div className="md:col-span-2 space-y-6">
          {merged.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.01 }}
              className="flex gap-5 p-5 rounded-2xl backdrop-blur bg-white/70 shadow-sm hover:shadow-md transition"
            >
              {/* IMAGE */}
              <div className="relative w-28 h-28 rounded-xl overflow-hidden">
                <Image
                  src={item.images?.[0] || item.thumbnail || "/fallback.png"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h3 className="font-medium text-lg line-clamp-2">
                  {item.title}
                </h3>

                {/* PRICE */}
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xl font-semibold">
                    ${item.discountedPrice.toFixed(2)}
                  </span>

                  {item.discountPercentage && (
                    <>
                      <span className="line-through text-gray-400">
                        ${item.price}
                      </span>
                      <span className="text-green-600 text-sm font-medium">
                        -{item.discountPercentage}%
                      </span>
                    </>
                  )}
                </div>

                {/* QTY */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => updateQty(item._id, -1)}
                    className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>

                  <span className="font-medium">{item.qty}</span>

                  <button
                    onClick={() => updateQty(item._id, 1)}
                    className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col justify-between items-end">
                <p className="font-semibold text-lg">
                  ${(item.discountedPrice * item.qty).toFixed(2)}
                </p>

                <button
                  onClick={() => removeItem(item._id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="sticky top-24 h-fit p-6 rounded-2xl bg-white/80 backdrop-blur shadow-lg">
          {/* TITLE */}
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          {/* PRICING */}
          <div className="space-y-3 text-sm text-gray-700">
            {/* Subtotal */}
            <div className="flex justify-between text-2xl font-extrabold">
              <span>Subtotal</span>
              <span className="text-2xl font-extrabold">${subtotal.toFixed(2)}</span>
            </div>

            {/* Shipping Info */}
            <div className="pt-3 border-t">
              <p className="text-xs text-gray-400 mb-2">Shipping options</p>

              <div className="flex justify-between text-gray-600">
                <span>Inside Dhaka</span>
                <span className="text-green-600 font-semibold">৳80</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Outside Dhaka</span>
                <span className="text-green-600 font-semibold">৳120</span>
              </div>
            </div>
          </div>

          {/* NOTE */}
          <p className="text-xs text-gray-400 mt-4">
            Shipping will be calculated at checkout
          </p>

          {/* BUTTON */}
          <Link href="/checkout">
            <button className="w-full mt-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition">
              Proceed to Checkout →
            </button>
          </Link>

          {/* CONTINUE SHOPPING */}
          <Link
            href="/collections"
            className="block text-center mt-4 text-sm text-gray-500 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
