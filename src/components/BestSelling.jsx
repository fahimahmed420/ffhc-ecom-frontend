"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";

/* ================= Skeleton ================= */
function BestSellingSkeleton() {
  return (
    <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-12" />

      <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="border bg-white">
            <div className="w-full aspect-square bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-8 w-full bg-gray-200 rounded mt-6" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= Main ================= */
export default function BestSelling() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ⭐ Calculate avg rating from MongoDB reviews */
  const calculateAvg = (reviews = []) => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
    );
  };

  /* ⭐ Star renderer */
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<IoMdStar key={i} />);
      else if (i - rating <= 0.5) stars.push(<IoMdStarHalf key={i} />);
      else stars.push(<IoMdStarOutline key={i} />);
    }
    return stars;
  };

  /* 🔄 Load products */
  const loadProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products;

        const enriched = list.map((p) => ({
          ...p,
          avgRating: calculateAvg(p.reviews || []),
        }));

        const sorted = enriched
          .sort((a, b) => b.avgRating - a.avgRating)
          .slice(0, 4);

        setProducts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id);

    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  if (loading) return <BestSellingSkeleton />;

  return (
    <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <h2 className="text-2xl mb-12 text-center font-semibold">
        Best Selling
      </h2>

      <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
        {products.map((p) => (
          <motion.div
            key={p._id}
            whileHover={{ y: -6 }}
            className="group border bg-white cursor-pointer relative overflow-hidden"
            onClick={() => router.push(`/collections/${p._id}`)}
          >
            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden">
              <Image
                src={p.thumbnail || "/fallback.png"}
                alt={p.title}
                fill
                className="object-cover group-hover:scale-105 transition"
                onError={(e) => (e.currentTarget.src = "/fallback.png")}
              />

              {/* ⭐ Rating */}
              <div className="absolute top-2 right-2 text-[11px] border bg-white px-3 py-1 flex items-center gap-1">
                {renderStars(p.avgRating)}
                <span className="text-[10px] ml-1">
                  {p.avgRating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 relative">
              <h3 className="text-sm font-medium mb-2 line-clamp-1">
                {p.title}
              </h3>

              <p className="text-sm text-gray-500 mb-2">${p.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p);
                }}
                className="absolute bottom-0 left-0 w-full bg-black text-white py-2 text-[11px] translate-y-full group-hover:translate-y-0 transition"
              >
                ADD TO CART
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}