"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoMdStar,IoMdStarHalf,IoMdStarOutline   } from "react-icons/io";

export default function BestSelling() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock per-product reviews
  const generateReviews = (product) => {
    const reviewCount = Math.floor(Math.random() * 6) + 5;
    const reviews = Array.from({ length: reviewCount }, () => Math.floor(Math.random() * 5) + 1);
    return reviews;
  };

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.products
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4)
          .map((p) => {
            const reviews = generateReviews(p);
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
        stars.push(<IoMdStar key={i} className=" inline-block" />);
      } else if (i - rating <= 0.5) {
        stars.push(<IoMdStarHalf key={i} className=" inline-block" />);
      } else {
        stars.push(<IoMdStarOutline key={i} className=" inline-block" />);
      }
    }
    return stars;
  };

  if (loading) return <p className="text-center text-gray-400 mt-6">Loading products...</p>;

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
            <div className="relative w-full aspect-[4/4] overflow-hidden">
              <Image
                src={p.thumbnail}
                alt={p.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Rating Badge */}
                <div className="absolute top-2 right-2 text-[11px] tracking-widest border px-3 py-1">
                {renderStars(p.avgRating)}
                <span className="ml-1 text-[10px]">{p.avgRating.toFixed(1)}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 relative">
              <h3 className="text-sm font-medium mb-2">{p.title}</h3>
              <p className="text-sm text-gray-500 mb-2">${p.price}</p>

              {/* Hover underline
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></div> */}
            {/* Add to cart button */}
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