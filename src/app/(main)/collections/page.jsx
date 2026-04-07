"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(18);
  const cartRef = useRef(null);

  const [hoverImages, setHoverImages] = useState({});
  const [mobileIndex, setMobileIndex] = useState({});

  // FETCH (MongoDB + categories + _id safe)
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
      const formatted = data.map((p) => ({
  ...p,
  _id: p._id?.toString?.() || p._id,
}));

        setProducts(formatted);

        //  dynamic categories
        const uniqueCategories = [
          "All",
          ...new Set(formatted.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  let filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (sortOrder === "asc")
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  else if (sortOrder === "desc")
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const addToCart = (product) => {
    if (!cart.includes(product._id)) {
      setCart((prev) => [...prev, product._id]);
      const img = document.getElementById(`img-${product._id}`);
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
          { duration: 600, easing: "ease-in-out" },
        ).onfinish = () => clone.remove();
      }
    }
  };

  const loadMore = () => setVisibleCount((prev) => prev + 18);

  //  FIXED swipe (_id instead of id + safety)
  const handleSwipe = (id, direction) => {
    setMobileIndex((prev) => {
      const current = prev[id] || 0;
      const product = filteredProducts.find((p) => p._id === id);
      if (!product || !product.images) return prev;

      const maxIndex = product.images.length - 1;

      let nextIndex = current + direction;
      if (nextIndex < 0) nextIndex = maxIndex;
      if (nextIndex > maxIndex) nextIndex = 0;

      return { ...prev, [id]: nextIndex };
    });
  };

  const renderSkeleton = () => (
    <div className="animate-pulse flex flex-col md:flex-row md:items-start md:gap-4 border border-gray-200 p-3 bg-white rounded-lg">
      <div className="bg-gray-200 w-full md:w-32 h-32 rounded-lg mb-3 md:mb-0"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="px-4 md:px-12 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 text-center md:text-left">
        <p className="text-xs tracking-widest text-gray-400 mb-2">
          OUR COLLECTIONS
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold mb-3">
          SHOP THE LATEST PRODUCTS
        </h1>
        <p className="text-sm text-gray-500 max-w-xl leading-relaxed mb-4">
          Discover a curated selection of accessories, kids’ items, jewelry, car
          essentials, and more.
        </p>
        <div className="flex justify-end">
          <div className="text-sm">
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

      {/* Categories mobile */}
      <div className="md:hidden mb-6 overflow-x-auto">
        <div className="flex flex-wrap gap-2 max-h-[5rem]">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block">
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

        {/* Products */}
        <div className="md:col-span-3 grid md:grid-cols-3 grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: visibleCount }).map((_, i) => (
              <div key={i}>{renderSkeleton()}</div>
            ))
          ) : filteredProducts.length === 0 ? (
            <p className="text-sm text-gray-400">No products found.</p>
          ) : (
            filteredProducts.slice(0, visibleCount).map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="group border border-gray-200 p-3 bg-white cursor-pointer relative"
                onMouseEnter={() =>
                  product.images?.length > 1 &&
                  setHoverImages((prev) => ({
                    ...prev,
                    [product._id]: product.images[1],
                  }))
                }
                onMouseLeave={() =>
                  product.images?.length > 1 &&
                  setHoverImages((prev) => ({
                    ...prev,
                    [product._id]: product.images?.[0] || product.thumbnail,
                  }))
                }
              >
                {/* Favorite */}
                <div
                  onClick={() => toggleFavorite(product._id)}
                  className={`absolute top-2 left-2 z-10 p-2 rounded-full ${
                    favorites.includes(product._id)
                      ? "text-red-500"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  <AiFillHeart size={18} />
                </div>

                {/* Image */}
                <Link href={`/collections/${product._id.toString()}`}>
                
                  <div
                    id={`img-${product._id}`}
                    className="relative h-[200px] md:h-[260px] overflow-hidden mb-4"
                  >
                    <Image
                      src={
                        hoverImages[product._id] ||
                        product.images?.[0] ||
                        product.thumbnail
                      }
                      alt={product.title}
                      fill
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src = "/image-not-found.png";
                      }}
                      className="object-cover group-hover:scale-105 transition duration-500 hidden md:block"
                    />

                    <div className="md:hidden relative w-full h-full">
                      <Image
                        src={
                          product.images?.[mobileIndex[product._id] || 0] ||
                          product.thumbnail
                        }
                        alt={product.title}
                        fill
                        unoptimized
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/image-not-found.png";
                        }}
                      />
                    </div>
                  </div>

                  <h3 className="text-sm tracking-widest mb-1">
                    {product.title?.toUpperCase() || "NO TITLE"}
                  </h3>
                  <p className="text-sm text-gray-500">${product.price}</p>
                </Link>

                {/* Cart */}
                <motion.div
                  onClick={() => addToCart(product)}
                  whileTap={{ scale: 1.2 }}
                  className={`absolute bottom-2 right-2 ${
                    cart.includes(product._id)
                      ? "text-green-600"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  <AiOutlineShoppingCart size={20} />
                </motion.div>

                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all"></div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Load More */}
      {filteredProducts.length > 18 && (
        <div className="text-center mt-6 flex justify-center gap-4">
          {visibleCount < filteredProducts.length && (
            <button onClick={loadMore}>LOAD MORE</button>
          )}
        </div>
      )}

      <div ref={cartRef} className="fixed top-6 right-6 w-10 h-10 z-50"></div>
    </section>
  );
}
