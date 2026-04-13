"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// ✅ BEST PRACTICE: SLUG → CATEGORY MAP
const categoryMap = {
  "glamour-and-beauty": "Glamour & Beauty",
  "intimate-and-personal-care": "Intimate & Personal Care",
  "auto-parts": "Auto Parts",
  "fashion": "Fashion",
  "tools-and-hardware": "Tools & Hardware",
  "stationery": "Stationery",
  "mother-and-baby": "Mother & Baby",
  "travel-and-accessories": "Travel & Accessories",
  "home-and-kitchen": "Home & kitchen",
};

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();

  // ✅ Get exact DB category name
  const categoryName = categoryMap[slug] || "All";

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);
  const fetching = useRef(false);

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const fetchProducts = useCallback(
    async (reset = false) => {
      if (fetching.current) return;

      fetching.current = true;
      setLoading(true);

      try {
        const res = await fetch(
          `/api/products?category=${encodeURIComponent(
            categoryName
          )}&page=${reset ? 0 : page}&limit=12&sort=${sort}`
        );

        const data = await res.json();

        const newProducts = data.products || [];

        setProducts((prev) =>
          reset ? newProducts : [...prev, ...newProducts]
        );

        setHasMore(data.hasMore);
      } catch (err) {
        console.error("Fetch error:", err);
      }

      setLoading(false);
      fetching.current = false;
    },
    [categoryName, page, sort]
  );

  // ===============================
  // RESET WHEN CATEGORY OR SORT CHANGES
  // ===============================
  useEffect(() => {
    setPage(0);
    fetchProducts(true);
  }, [categoryName, sort]);

  // ===============================
  // LOAD MORE
  // ===============================
  useEffect(() => {
    if (page === 0) return;
    fetchProducts();
  }, [page]);

  // ===============================
  // INFINITE SCROLL
  // ===============================
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((p) => p + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 py-10">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span onClick={() => router.push("/")} className="cursor-pointer">
          Home
        </span>
        {" > "}
        <span className="text-black">{categoryName}</span>
      </div>

      {/* Banner */}
      <div className="relative h-[220px] mb-8 rounded-xl overflow-hidden">
        <Image
          src={`/categories/${categoryName}.jpg`}
          alt={categoryName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end p-6">
          <h1 className="text-white text-3xl font-bold">
            {categoryName}
          </h1>
        </div>
      </div>

      {/* SORT */}
      <div className="flex justify-between mb-6">
        <h2 className="font-semibold">Products</h2>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="default">Default</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div key={product._id} whileHover={{ scale: 1.03 }}>
            <Link href={`/collections/${product._id}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow">

                <div className="relative h-[220px]">
                  <Image
                    src={product.images?.[0] || product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-sm">{product.title}</h3>
                  <p className="font-semibold">${product.price}</p>
                </div>

              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* LOADER */}
      {loading && (
        <p className="text-center mt-6 text-gray-500">Loading...</p>
      )}

      <div ref={loaderRef} className="h-10" />

      {/* NO PRODUCTS */}
      {!loading && products.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No products found in this category.
        </p>
      )}
    </section>
  );
}