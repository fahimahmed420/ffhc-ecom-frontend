"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AiOutlineShoppingCart, AiFillHeart } from "react-icons/ai";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const cartRef = useRef(null);

  // Fetch cart products (simulate)
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const items = storedCart.map((id) => storedProducts.find((p) => p.id === id)).filter(Boolean);
    setCartItems(items);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    // Also remove from localStorage if using persistent cart
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem(
      "cart",
      JSON.stringify(storedCart.filter((itemId) => itemId !== id))
    );
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item)
    );
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  return (
    <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-center md:text-left">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-400 text-center">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 grid md:grid-cols-1 gap-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                className="group flex flex-col md:flex-row items-center border border-gray-200 bg-white p-4 rounded-lg relative"
              >
                {/* Favorite */}
                <div
                  onClick={() => toggleFavorite(item.id)}
                  className={`absolute top-3 right-3 cursor-pointer text-xl ${
                    favorites.includes(item.id) ? "text-red-500" : "text-gray-400 hover:text-black"
                  }`}
                >
                  <AiFillHeart />
                </div>

                {/* Image */}
                <div className="relative w-full md:w-32 h-32 flex-shrink-0 mb-3 md:mb-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 md:ml-6 flex flex-col justify-between w-full">
                  <h3 className="text-sm md:text-base font-semibold mb-1">{item.name.toUpperCase()}</h3>
                  <p className="text-sm text-gray-500 mb-2">${item.price}</p>

                  {/* Quantity & Remove */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full md:w-1/3 border border-gray-200 bg-white p-6 rounded-lg flex flex-col gap-4 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
              <span>Total</span>
              <span>${(totalPrice + 5).toFixed(2)}</span>
            </div>
            <button className="mt-6 bg-black text-white px-6 py-3 tracking-widest text-sm hover:bg-white hover:text-black transition">
              CHECKOUT
            </button>
          </div>
        </div>
      )}

      <div ref={cartRef} className="fixed top-6 right-6 w-10 h-10 z-50"></div>
    </section>
  );
}