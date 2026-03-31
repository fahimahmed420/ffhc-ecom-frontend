"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [sortOrder, setSortOrder] = useState("default"); // "default" | "asc" | "desc"
  const [categories, setCategories] = useState([]);
  const cartRef = useRef(null);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.products.map((p) => ({
          id: p.id,
          name: p.title,
          price: p.price,
          image: p.thumbnail,
          category: p.category,
        }));
        setProducts(formatted);

        // Get unique categories dynamically
        const uniqueCategories = [
          "All",
          ...Array.from(new Set(formatted.map((p) => p.category))),
        ];
        setCategories(uniqueCategories);

        setLoading(false);
      });
  }, []);

  // Filter by category
  let filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // Sort products by price
  if (sortOrder === "asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const addToCart = (product) => {
    if (!cart.includes(product.id)) {
      setCart((prev) => [...prev, product.id]);

      // Animate image flying to cart
      const img = document.getElementById(`img-${product.id}`);
      if (img && cartRef.current) {
        const clone = img.cloneNode(true);
        const rect = img.getBoundingClientRect();
        clone.style.position = "fixed";
        clone.style.left = rect.left + "px";
        clone.style.top = rect.top + "px";
        clone.style.width = rect.width + "px";
        clone.style.height = rect.height + "px";
        clone.style.zIndex = 9999;
        clone.style.borderRadius = "8px";
        clone.style.pointerEvents = "none";
        document.body.appendChild(clone);

        const cartRect = cartRef.current.getBoundingClientRect();

        clone.animate(
          [
            { transform: "translate(0,0) scale(1)", opacity: 1 },
            {
              transform: `translate(${cartRect.left - rect.left}px, ${
                cartRect.top - rect.top
              }px) scale(0.2)`,
              opacity: 0.5,
            },
          ],
          { duration: 600, easing: "ease-in-out" }
        ).onfinish = () => {
          clone.remove();
        };
      }
    }
  };

  return (
    <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 text-center md:text-left">
        <p className="text-xs tracking-widest text-gray-400 mb-2">
          OUR COLLECTIONS
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          SHOP THE LATEST PRODUCTS
        </h1>

        <p className="text-sm text-gray-500 max-w-xl leading-relaxed mb-4">
          Discover a curated selection of accessories, kids’ items, jewelry,
          car essentials, and more. Quality products designed to fit your
          lifestyle.
        </p>

        {/* Sort Dropdown */}
        <div className="flex justify-end">
          <div className=" text-sm">
          <label className="mr-2 font-medium">Sort by price:</label>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
        </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-10">
        {/* Sidebar Categories */}
        <aside>
          <p className="text-xs tracking-widest mb-6">CATEGORIES</p>

          <div className="space-y-3 text-sm text-gray-500">
            {categories.map((cat, i) => (
              <p
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer ${
                  selectedCategory === cat
                    ? "text-black font-semibold"
                    : "hover:text-black"
                }`}
              >
                {cat.toUpperCase()}
              </p>
            ))}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="md:col-span-3 grid md:grid-cols-3 grid-cols-2 gap-8">
          {loading ? (
            <p className="text-sm text-gray-400">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-sm text-gray-400">No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                className="group relative cursor-pointer bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
              >
                {/* Favourite Icon */}
                <div
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-2 left-2 z-10 p-2 rounded-full shadow-md hover:scale-110 transition cursor-pointer ${
                    favorites.includes(product.id)
                      ? "bg-red-100 text-red-500"
                      : "bg-white text-gray-400"
                  }`}
                >
                  <AiFillHeart size={20} />
                </div>

                {/* Product Image */}
                <Link href={`/collections/${product.id}`}>
                  <div
                    id={`img-${product.id}`}
                    className="relative h-[320px] overflow-hidden mb-4"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="px-4 pb-4">
                    <h3 className="text-sm mb-1 font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500 font-semibold">
                      ${product.price}
                    </p>
                  </div>
                </Link>

                {/* Cart Icon */}
                <motion.div
                  onClick={() => addToCart(product)}
                  whileTap={{ scale: 1.2 }}
                  className={`absolute bottom-2 right-2 z-10 p-2 rounded-full shadow-md cursor-pointer transition ${
                    cart.includes(product.id)
                      ? "bg-green-100 text-green-600"
                      : "bg-white text-gray-800 hover:scale-110"
                  }`}
                >
                  <AiOutlineShoppingCart size={20} />
                </motion.div>
              </motion.div>
            ))
          )}
        </div>
      </div>


      {/* Promotional Banner */}
      <div className="mt-24 grid md:grid-cols-2 gap-10 items-center bg-gray-50 p-6 rounded-lg">
        <div className="relative h-[400px] overflow-hidden rounded-lg">
          <Image
            src="/banner.jpg"
            alt="Featured Products"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">
            ELEVATE YOUR STYLE
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Shop the latest in fashion, accessories, kids’ essentials, and home
            must-haves. High-quality products designed for everyday life.
          </p>

          <div className="flex gap-6 text-xs tracking-widest">
            <button className="border-b border-gray-800">VIEW JOURNAL</button>
            <button className="border-b border-gray-800">LEARN MORE</button>
          </div>
        </div>
      </div>
    </section>
  );
}