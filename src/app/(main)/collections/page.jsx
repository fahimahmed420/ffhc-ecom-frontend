"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);
  const fetchingRef = useRef(false);

  // ✅ LOAD STORAGE
  useEffect(() => {
    const w = localStorage.getItem("wishlist");
    const c = localStorage.getItem("cart");

    if (w) setWishlist(JSON.parse(w));
    if (c) setCart(JSON.parse(c));
  }, []);

  // ✅ SAVE HELPERS
  const updateWishlist = (list) => {
    setWishlist(list);
    localStorage.setItem("wishlist", JSON.stringify(list));
  };

  const updateCart = (list) => {
    setCart(list);
    localStorage.setItem("cart", JSON.stringify(list));
  };

  // ❤️ WISHLIST TOGGLE
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      updateWishlist(wishlist.filter((i) => i !== id));
      toast("Removed from wishlist ❌");
    } else {
      updateWishlist([...wishlist, id]);
      toast.success("Added to wishlist ❤️");
    }
  };

  // 🛒 ADD TO CART
  const addToCart = (product) => {
    if (cart.includes(product._id)) {
      toast("Already in cart ⚠️");
      return;
    }

    const updated = [...cart, product._id];
    updateCart(updated);
    toast.success("Added to cart 🛒");
  };

  // 🚀 FETCH PRODUCTS
  const fetchProducts = useCallback(
    async (reset = false) => {
      if (fetchingRef.current) return;
      if (!hasMore && !reset) return;

      fetchingRef.current = true;
      setLoading(true);

      try {
        const res = await fetch(
          `/api/products?page=${
            reset ? 0 : page
          }&limit=12&category=${selectedCategory}&sort=${sortOrder}`
        );

        const data = await res.json();
        const newProducts = data.products || [];

        setProducts((prev) => {
          if (reset) return newProducts;

          const ids = new Set(prev.map((p) => p._id));
          const filtered = newProducts.filter((p) => !ids.has(p._id));

          return [...prev, ...filtered];
        });

        setHasMore(data.hasMore);

        if (categories.length === 0 && newProducts.length > 0) {
          setCategories([
            "All",
            ...new Set(newProducts.map((p) => p.category)),
          ]);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
      fetchingRef.current = false;
    },
    [page, selectedCategory, sortOrder, hasMore, categories.length]
  );

  useEffect(() => {
    fetchProducts(true);
  }, []);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchProducts(true);
  }, [selectedCategory, sortOrder]);

  useEffect(() => {
    if (page === 0) return;
    fetchProducts();
  }, [page]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !fetchingRef.current) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <section className="px-4 md:px-12 py-10 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Latest Products
        </h1>

        {/* ✨ MODERN SORT */}
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/70 backdrop-blur border shadow-sm hover:shadow-md transition focus:outline-none"
          >
            <option value="default">Sort</option>
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
          </select>

          <span className="absolute right-3 top-2.5 text-gray-500">⌄</span>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {/* CLICKABLE CARD */}
            <Link href={`/collections/${product._id}`}>
              <div className="cursor-pointer">
                <div className="relative h-[220px]">
                  <Image
                    src={product.images?.[0] || product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />

                  {/* ❤️ */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product._id);
                    }}
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full shadow"
                  >
                    {wishlist.includes(product._id) ? (
                      <AiFillHeart className="text-red-500" />
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-medium line-clamp-2 mb-1">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between mt-2">
                    <p className="font-semibold text-lg">
                      ${product.price}
                    </p>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white transition"
                    >
                      <AiOutlineShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* ✨ SHIMMER SKELETON */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[300px] rounded-xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.5s_infinite]" />
            </div>
          ))}
      </div>

      {/* LOAD TRIGGER */}
      <div ref={loaderRef} className="h-10"></div>

      {/* SHIMMER STYLE */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}