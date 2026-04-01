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

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.products.map((p) => ({
          id: p.id,
          name: p.title,
          price: p.price,
          image: p.thumbnail,
          images: p.images.length > 1 ? p.images : [p.thumbnail],
          category: p.category,
        }));
        setProducts(formatted);
        const uniqueCategories = [
          "All",
          ...Array.from(new Set(formatted.map((p) => p.category))),
        ];
        setCategories(uniqueCategories);
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
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const addToCart = (product) => {
    if (!cart.includes(product.id)) {
      setCart((prev) => [...prev, product.id]);
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
              transform: `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.2)`,
              opacity: 0.5,
            },
          ],
          { duration: 600, easing: "ease-in-out" }
        ).onfinish = () => clone.remove();
      }
    }
  };

  const loadMore = () => setVisibleCount((prev) => prev + 18);

  const handleSwipe = (id, direction) => {
    setMobileIndex((prev) => {
      const current = prev[id] || 0;
      const maxIndex =
        filteredProducts.find((p) => p.id === id).images.length - 1;
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
        {/* Sidebar desktop */}
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

        {/* Product grid */}
        <div className="md:col-span-3 grid md:grid-cols-3 grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: visibleCount }).map((_, i) => (
                <div key={i}>{renderSkeleton()}</div>
              ))
            : filteredProducts.length === 0
            ? <p className="text-sm text-gray-400">No products found.</p>
            : filteredProducts.slice(0, visibleCount).map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="group border border-gray-200 p-3 bg-white cursor-pointer relative"
                  onMouseEnter={() =>
                    product.images.length > 1 &&
                    setHoverImages((prev) => ({
                      ...prev,
                      [product.id]: product.images[1],
                    }))
                  }
                  onMouseLeave={() =>
                    product.images.length > 1 &&
                    setHoverImages((prev) => ({
                      ...prev,
                      [product.id]: product.images[0],
                    }))
                  }
                >
                  {/* Favorite */}
                  <div
                    onClick={() => toggleFavorite(product.id)}
                    className={`absolute top-2 left-2 z-10 p-2 rounded-full transition cursor-pointer ${
                      favorites.includes(product.id)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-black"
                    }`}
                  >
                    <AiFillHeart size={18} />
                  </div>

                  {/* Image */}
                  <Link href={`/collections/${product.id}`}>
                    <div
                      id={`img-${product.id}`}
                      className="relative h-[200px] md:h-[260px] overflow-hidden mb-4"
                    >
                      {/* Desktop hover */}
                      <Image
                        src={hoverImages[product.id] || product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500 hidden md:block"
                      />
                      {/* Mobile swipe */}
                      <div className="md:hidden relative w-full h-full overflow-hidden">
                        <Image
                          src={product.images[mobileIndex[product.id] || 0]}
                          alt={product.name}
                          fill
                          className="object-cover transition duration-500"
                        />
                        {product.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleSwipe(product.id, -1);
                              }}
                              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                            >
                              ‹
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleSwipe(product.id, 1);
                              }}
                              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                            >
                              ›
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="text-sm tracking-widest mb-1">
                        {product.name.toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        ${product.price}
                      </p>
                    </div>
                  </Link>

                  {/* Cart */}
                  <motion.div
                    onClick={() => addToCart(product)}
                    whileTap={{ scale: 1.2 }}
                    className={`absolute bottom-2 right-2 z-10 cursor-pointer transition ${
                      cart.includes(product.id)
                        ? "text-green-600"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    <AiOutlineShoppingCart size={20} />
                  </motion.div>

                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></div>
                </motion.div>
              ))}
        </div>
      </div>

      {/* Load More / Load Less */}
      {filteredProducts.length > 18 && (
        <div className="text-center mt-6 flex justify-center gap-4 flex-wrap">
          {visibleCount < filteredProducts.length && (
            <button
              onClick={loadMore}
              className="bg-black text-white px-6 py-3 tracking-widest text-sm hover:bg-white hover:text-black transition"
            >
              LOAD MORE
            </button>
          )}
          {visibleCount > 18 && (
            <button
              onClick={() => setVisibleCount(18)}
              className="bg-black text-white px-6 py-3 tracking-widest text-sm hover:bg-white hover:text-black transition"
            >
              LOAD LESS
            </button>
          )}
        </div>
      )}

      <div ref={cartRef} className="fixed top-6 right-6 w-10 h-10 z-50"></div>
    </section>
  );
}