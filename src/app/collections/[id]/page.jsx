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

        // ✅ API Reviews + Local Reviews Merge
        const apiReviews = (data.reviews || []).map((r, index) => ({
          id: index + 1,
          name: r.reviewerName,
          rating: r.rating,
          comment: r.comment,
        }));

        const storedReviews =
          JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];

        setReviews([...apiReviews, ...storedReviews]);

        // wishlist
        const storedWishlist =
          JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(storedWishlist);

        // related
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

  if (loading) return <p className="text-center mt-20">Loading...</p>;
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

  // ✅ correct avg rating
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

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/">Home</Link> &gt;{" "}
        <Link href="/collections">Collections</Link> &gt;{" "}
        <span className="text-black">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="relative h-[450px] w-full mb-4 bg-white rounded-lg overflow-hidden">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {product.images?.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImage(img)}
                className={`cursor-pointer h-24 relative rounded-lg overflow-hidden border-2 ${
                  img === mainImage ? "border-black" : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
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

          <p className="text-gray-600 mb-3">{product.description}</p>

          {/* Availability */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className={`w-3 h-3 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`}
            />
            <p>{product.availabilityStatus}</p>
          </div>

          {/* Quantity + Cart */}
          <div className="flex gap-4 mb-4">
            <div className="flex border rounded">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-6 py-2"
            >
              Add to Cart
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={toggleWishlist}
            className="border w-full py-3 rounded mb-6"
          >
            {isWishlisted ? "❤️ Saved" : "♡ Save to Wishlist"}
          </button>

          {/* Shipping + Return */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-4 bg-gray-50 rounded flex flex-col items-center justify-center text-center">
              <MdLocalShipping className="text-2xl mb-2" />
              <p className="font-semibold">SHIPPING</p>
              <p className="text-sm text-gray-600">
                {product.shippingInformation}
              </p>
            </div>

            <div className="border p-4 bg-gray-50 rounded flex flex-col items-center justify-center text-center">
              <GiReturnArrow className="text-2xl mb-2" />
              <p className="font-semibold">RETURNS</p>
              <p className="text-sm text-gray-600">{product.returnPolicy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20">
        <div className="flex justify-between mb-3">
          <h2 className="text-2xl font-semibold mb-6">Verified Reviews</h2>
          <button
            onClick={() => isLoggedIn && setShowReviewModal(true)}
            className="bg-black text-white px-6 py-2 "
          >
            Write a Review
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-gray-50 p-5 rounded border">
              <div className="flex justify-between">
                <p className="font-semibold">{r.name}</p>
                <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">"{r.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

            <input
              placeholder="Your Name"
              className="border p-2 w-full mb-2"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
            />

            {/* Star Input */}
            <div className="flex gap-1 mb-3">
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
              className="border p-2 w-full mb-2"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowReviewModal(false)}>Cancel</button>

              <button
                onClick={handleReviewSubmit}
                className="bg-black text-white px-4 py-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Related Products */}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {related.map((p) => {
            const discounted = p.discountPercentage
              ? (p.price * (100 - p.discountPercentage)) / 100
              : p.price;

            return (
              <Link key={p.id} href={`/collections/${p.id}`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="relative h-48 w-full bg-gray-50">
                    <Image
                      src={p.thumbnail}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <p className="text-sm mb-1">{p.title}</p>

                    <div className="flex gap-2 text-sm">
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
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded">
          {toast}
        </div>
      )}
    </section>
  );
}
