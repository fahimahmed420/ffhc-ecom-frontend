"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { MdLocalShipping } from "react-icons/md";
import { GiReturnArrow } from "react-icons/gi";

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [mainImage, setMainImage] = useState("");

  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const isLoggedIn = true;

  useEffect(() => {
    setLoading(true);

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then(async (data) => {
        setProduct(data);
        setMainImage(data.thumbnail);

        const apiReviews = (data.reviews || []).map((r, index) => ({
          id: index + 1,
          name: r.reviewerName,
          rating: r.rating,
          comment: r.comment,
        }));

        const storedReviews =
          JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];

        setReviews([...apiReviews, ...storedReviews]);

        const storedWishlist =
          JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(storedWishlist);

        const relatedRes = await fetch(
          `https://dummyjson.com/products/category/${encodeURIComponent(
            data.category,
          )}`,
        );
        const relatedData = await relatedRes.json();

        setRelated(
          relatedData.products.filter((p) => p.id !== data.id).slice(0, 4),
        );

        setLoading(false);
      });
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

 if (loading) return <ProductSkeleton />;
  if (!product) return <p className="text-center mt-20">Not found</p>;

  const discountedPrice = product.discountPercentage
    ? (product.price * (100 - product.discountPercentage)) / 100
    : product.price;

  const inStock = product.availabilityStatus === "In Stock";

  const isWishlisted = wishlist.find((item) => item.id === product.id);

  const toggleWishlist = () => {
    let updated;

    if (isWishlisted) {
      updated = wishlist.filter((item) => item.id !== product.id);
      showToast("Removed from wishlist");
    } else {
      updated = [...wishlist, product];
      showToast("Added to wishlist ❤️");
    }

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("Added to cart 🛒");
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const handleReviewSubmit = () => {
    if (!newReview.name || !newReview.comment) return;

    const newEntry = {
      ...newReview,
      id: Date.now(),
    };

    const updated = [...reviews, newEntry];

    setReviews(updated);

    const localOnly = JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];

    localStorage.setItem(
      `reviews-${id}`,
      JSON.stringify([...localOnly, newEntry]),
    );

    setShowReviewModal(false);
    setNewReview({ name: "", rating: 5, comment: "" });

    showToast("Review submitted ⭐");
  };
  function ProductSkeleton() {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 animate-pulse">
        {/* Breadcrumb */}
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-6" />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Image Skeleton */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="h-[450px] w-full bg-gray-200 rounded-lg mb-4" />

            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Right Info Skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-1/4 bg-gray-200 rounded" />

            <div className="h-8 w-3/4 bg-gray-200 rounded" />

            <div className="h-4 w-1/2 bg-gray-200 rounded" />

            <div className="flex gap-4">
              <div className="h-6 w-20 bg-gray-200 rounded" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
            </div>

            <div className="h-20 w-full bg-gray-200 rounded" />

            <div className="h-4 w-1/3 bg-gray-200 rounded" />

            {/* Buttons */}
            <div className="flex gap-4">
              <div className="h-10 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-40 bg-gray-200 rounded" />
            </div>

            <div className="h-10 w-full bg-gray-200 rounded" />

            {/* Shipping boxes */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="h-28 bg-gray-200 rounded-lg" />
              <div className="h-28 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Reviews Skeleton */}
        <div className="mt-20">
          <div className="flex justify-between mb-6">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-10 w-32 bg-gray-200 rounded" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-20">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6" />

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/">Home</Link> &gt;{" "}
        <Link href="/collections">Collections</Link> &gt;{" "}
        <span className="text-black">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative h-[450px] w-full mb-4 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              priority
              quality={100}
              className="object-contain"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {product.images?.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImage(img)}
                className={`cursor-pointer h-24 relative rounded-lg overflow-hidden border transition ${
                  img === mainImage
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  quality={100}
                  className="object-contain bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="md:sticky md:top-20 h-fit">
          {product.discountPercentage && (
            <p className="text-red-500 mb-2 font-semibold">
              🔥 {product.discountPercentage}% OFF
            </p>
          )}

          <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-yellow-500">
              {"★".repeat(Math.round(avgRating))}
              {"☆".repeat(5 - Math.round(avgRating))}
            </span>
            <span className="text-sm text-gray-500">
              {avgRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex gap-4 mb-4">
            <span className="line-through text-gray-400">${product.price}</span>
            <span className="text-2xl font-bold">
              ${discountedPrice.toFixed(2)}
            </span>
          </div>

          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* Availability */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className={`w-3 h-3 rounded-full ${
                inStock ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <p>{product.availabilityStatus}</p>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg hover:bg-gray-100 transition disabled:opacity-40"
                disabled={quantity === 1}
              >
                −
              </button>

              <span className="px-5 py-2 text-sm border-x border-gray-300">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 text-lg hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition"
            >
              Add to Cart
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={toggleWishlist}
            className="border border-gray-300 w-full py-3 rounded-md hover:bg-black hover:text-white transition mb-6"
          >
            {isWishlisted ? "❤️ Saved" : "♡ Save to Wishlist"}
          </button>

          {/* Shipping / Returns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 p-4 bg-white rounded-lg flex flex-col items-center text-center shadow-sm">
              <MdLocalShipping className="text-2xl mb-2" />
              <p className="font-semibold">SHIPPING</p>
              <p className="text-sm text-gray-600">
                {product.shippingInformation}
              </p>
            </div>

            <div className="border border-gray-200 p-4 bg-white rounded-lg flex flex-col items-center text-center shadow-sm">
              <GiReturnArrow className="text-2xl mb-2" />
              <p className="font-semibold">RETURNS</p>
              <p className="text-sm text-gray-600">{product.returnPolicy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Verified Reviews</h2>

          <button
            onClick={() => isLoggedIn && setShowReviewModal(true)}
            className="px-6 py-2 border border-black bg-black text-white transition hover:bg-white hover:text-black"
          >
            Write a Review
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="border border-gray-200 rounded-xl p-5 bg-white transition hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">{r.name}</p>

                <span className="text-yellow-500 text-sm">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                "{r.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
      {showReviewModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-md border border-gray-200 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

            <input
              placeholder="Your Name"
              className="border border-gray-300 p-2 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
            />

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className={`cursor-pointer text-2xl ${
                    star <= newReview.rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Your Review"
              className="border border-gray-300 p-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleReviewSubmit}
                className="px-4 py-2 border border-black bg-black text-white rounded-md transition hover:bg-white hover:text-black"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((p) => {
            const discounted = p.discountPercentage
              ? (p.price * (100 - p.discountPercentage)) / 100
              : p.price;

            return (
              <Link key={p.id} href={`/collections/${p.id}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white transition hover:shadow-md"
                >
                  <div className="relative h-48 w-full bg-white border-b border-gray-100">
                    <Image
                      src={p.thumbnail}
                      alt={p.title}
                      fill
                      quality={100}
                      className="object-contain p-3"
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-sm font-medium line-clamp-2 mb-2">
                      {p.title}
                    </p>

                    <div className="flex gap-2 text-sm items-center">
                      <span className="line-through text-gray-400">
                        ${p.price}
                      </span>
                      <span className="font-semibold">
                        ${discounted.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
