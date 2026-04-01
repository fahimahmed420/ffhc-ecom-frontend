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
      {/* Title */}
      <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-12" />

      {/* Grid */}
      <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="border border-gray-200 bg-white relative overflow-hidden"
          >
            {/* Image */}
            <div className="w-full aspect-square bg-gray-200" />

            {/* Rating badge */}
            <div className="absolute top-2 right-2 flex items-center gap-2 border border-gray-300 bg-gray-100 px-3 py-1 rounded">
              <div className="h-3 w-10 bg-gray-300 rounded" />
              <div className="h-3 w-6 bg-gray-300 rounded" />
            </div>

            {/* Content */}
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

/* ================= Main Component ================= */
export default function BestSelling() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock reviews
  const generateReviews = () => {
    const reviewCount = Math.floor(Math.random() * 6) + 5;
    return Array.from(
      { length: reviewCount },
      () => Math.floor(Math.random() * 5) + 1,
    );
  };

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.products
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4)
          .map((p) => {
            const reviews = generateReviews();
            const avg = reviews.reduce((acc, r) => acc + r, 0) / reviews.length;

            return { ...p, reviews, avgRating: avg };
          });

        setProducts(sorted);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    console.log("Added to cart:", product);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<IoMdStar key={i} />);
      } else if (i - rating <= 0.5) {
        stars.push(<IoMdStarHalf key={i} />);
      } else {
        stars.push(<IoMdStarOutline key={i} />);
      }
    }
    return stars;
  };

  if (loading) return <BestSellingSkeleton />;

  return (
    <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <h2 className="text-2xl mb-12 text-center font-semibold">Best Selling</h2>

      <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
        {products.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="group border border-gray-200 bg-white cursor-pointer relative overflow-hidden"
            onClick={() => router.push(`/collections/${p.id}`)}
          >
            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden">
              <Image
                src={p.thumbnail}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                priority
              />

              {/* Rating Badge */}
              <div className="absolute top-2 right-2 text-[11px] tracking-widest border bg-white px-3 py-1 flex items-center gap-1">
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

              {/* Add to cart */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p);
                }}
                className="absolute bottom-0 left-0 w-full bg-black text-white py-2 text-[11px] tracking-widest translate-y-full group-hover:translate-y-0 transition duration-300"
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
