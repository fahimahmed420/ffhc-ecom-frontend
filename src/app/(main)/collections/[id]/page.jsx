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

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((p) => ({
          ...p,
          _id: p._id.toString(),
        }));

        const found = formatted.find((p) => p._id === id);

        if (!found) {
          setLoading(false);
          return;
        }

        setProduct(found);
        setMainImage(found.images?.[0] || found.thumbnail);

        // ✅ Format reviews
        const apiReviews = (found.reviews || []).map((r, index) => ({
          id: index + 1,
          name: r.reviewerName || r.name,
          rating: r.rating,
          comment: r.comment,
        }));

        const storedReviews = JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];
        setReviews([...apiReviews, ...storedReviews]);

        // ✅ Wishlist
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(storedWishlist);

        // ✅ Related products
        const relatedProducts = formatted
          .filter((p) => p.category === found.category && p._id !== found._id)
          .slice(0, 4);

        setRelated(relatedProducts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("Added to cart 🛒");
  };

  const toggleWishlist = () => {
    let updated;
    const isWishlisted = wishlist.find((item) => item._id === product._id);

    if (isWishlisted) {
      updated = wishlist.filter((item) => item._id !== product._id);
      showToast("Removed from wishlist");
    } else {
      updated = [...wishlist, product];
      showToast("Added to wishlist ❤️");
    }

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleReviewSubmit = () => {
    if (!newReview.name || !newReview.comment) return;
    const newEntry = { ...newReview, id: Date.now() };
    const updated = [...reviews, newEntry];
    setReviews(updated);

    const localOnly = JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];
    localStorage.setItem(`reviews-${id}`, JSON.stringify([...localOnly, newEntry]));

    setShowReviewModal(false);
    setNewReview({ name: "", rating: 5, comment: "" });
    showToast("Review submitted ⭐");
  };

  if (loading) return <ProductSkeleton />;
  if (!product) return <p className="text-center mt-20 text-gray-500">Product not found</p>;

  const discountedPrice = product.discountPercentage
    ? (product.price * (100 - product.discountPercentage)) / 100
    : product.price;

  const inStock = product.availabilityStatus === "In Stock" || (product.stock > 0);
  const isWishlisted = wishlist.find((item) => item._id === product._id);
  const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-6 py-3 rounded-full shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-black">Home</Link> &gt;{" "}
        <Link href="/collections" className="hover:text-black">Collections</Link> &gt;{" "}
        <span className="text-black">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images Column */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-fit">
          <div className="relative h-[450px] w-full mb-4 rounded-lg overflow-hidden border border-gray-100">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {product.images?.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImage(img)}
                className={`cursor-pointer h-24 relative rounded-lg overflow-hidden border transition ${
                  img === mainImage ? "border-black shadow-sm" : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image src={img} alt="" fill className="object-contain bg-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="md:sticky md:top-24 h-fit">
          {product.discountPercentage && (
            <p className="text-red-600 mb-2 font-bold uppercase text-xs tracking-widest">
              🔥 Special Offer: {product.discountPercentage}% OFF
            </p>
          )}

          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-yellow-500 flex text-lg">
              {"★".repeat(Math.round(avgRating))}
              <span className="text-gray-300">{"★".repeat(5 - Math.round(avgRating))}</span>
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {avgRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-black">${discountedPrice.toFixed(2)}</span>
            {product.discountPercentage && (
              <span className="line-through text-gray-400 text-lg">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description}</p>

          {/* Availability */}
          <div className="flex items-center gap-2 mb-8">
            <span className={`w-3 h-3 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`} />
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {inStock ? "In Stock & Ready to Ship" : "Out of Stock"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-5 py-3 hover:bg-gray-50 transition disabled:opacity-30"
                  disabled={quantity === 1}
                >−
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-5 py-3 hover:bg-gray-50 transition"
                >+
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-300"
              >
                ADD TO CART
              </button>
            </div>

            <button
              onClick={toggleWishlist}
              className="w-full py-4 border border-gray-300 rounded-lg font-semibold hover:bg-black hover:text-white transition flex justify-center items-center gap-2"
            >
              {isWishlisted ? "❤️ SAVED TO WISHLIST" : "♡ SAVE TO WISHLIST"}
            </button>
          </div>

          {/* Shipping / Returns Boxes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-100 p-5 bg-gray-50/50 rounded-xl flex flex-col items-center text-center">
              <MdLocalShipping className="text-3xl mb-2 text-gray-700" />
              <p className="font-bold text-xs uppercase mb-1">Shipping</p>
              <p className="text-xs text-gray-500">{product.shippingInformation || "Free standard shipping"}</p>
            </div>
            <div className="border border-gray-100 p-5 bg-gray-50/50 rounded-xl flex flex-col items-center text-center">
              <GiReturnArrow className="text-3xl mb-2 text-gray-700" />
              <p className="font-bold text-xs uppercase mb-1">Returns</p>
              <p className="text-xs text-gray-500">{product.returnPolicy || "30-day return policy"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-32 border-t border-gray-100 pt-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Verified Reviews</h2>
            <p className="text-gray-500">What our customers are saying about this product</p>
          </div>
          <button
            onClick={() => isLoggedIn && setShowReviewModal(true)}
            className="px-8 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition shadow-lg"
          >
            Write a Review
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r.id} className="p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
                <div className="flex justify-between mb-4">
                  <span className="font-bold text-lg">{r.name}</span>
                  <div className="text-yellow-500">{"★".repeat(r.rating)}</div>
                </div>
                <p className="text-gray-600 italic">"{r.comment}"</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No reviews yet. Be the first to write one!</p>
          )}
        </div>
      </div>

    {/* Related Products */}
<div className="mt-20">
  <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>

  {related.length === 0 ? (
    <p className="text-gray-400">No related products found.</p>
  ) : (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
      {related.map((p) => {
        const discounted = p.discountPercentage
          ? (p.price * (100 - p.discountPercentage)) / 100
          : p.price;

        return (
          <Link key={p._id} href={`/collections/${p._id}`}>
            <motion.div
              whileHover={{ y: -6 }}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white transition hover:shadow-md cursor-pointer"
            >
              <div className="relative h-48 w-full bg-white border-b border-gray-100">
                <Image
                  src={p.thumbnail}
                  alt={p.title}
                  fill
                  className="object-contain p-3"
                />
              </div>

              <div className="p-4">
                <p className="text-sm font-medium line-clamp-2 mb-2">
                  {p.title}
                </p>

                <div className="flex gap-2 text-sm items-center">
                  {p.discountPercentage && (
                    <span className="line-through text-gray-400">
                      ${p.price}
                    </span>
                  )}
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
  )}
</div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Share Your Thoughts</h3>
            <input
              placeholder="Full Name"
              className="w-full p-4 bg-gray-50 rounded-xl border-none mb-4 focus:ring-2 focus:ring-black outline-none"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            />
            <div className="flex gap-2 mb-6 justify-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setNewReview({ ...newReview, rating: s })} className={`text-3xl ${s <= newReview.rating ? "text-yellow-500" : "text-gray-200"}`}>★</button>
              ))}
            </div>
            <textarea
              placeholder="What did you think of the product?"
              rows={4}
              className="w-full p-4 bg-gray-50 rounded-xl border-none mb-6 focus:ring-2 focus:ring-black outline-none"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowReviewModal(false)} className="flex-1 py-3 font-bold text-gray-500">Cancel</button>
              <button onClick={handleReviewSubmit} className="flex-1 py-3 bg-black text-white rounded-xl font-bold">Submit</button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

// Ported Skeleton Component
function ProductSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 animate-pulse">
      <div className="h-4 w-1/3 bg-gray-200 rounded mb-10" />
      <div className="grid md:grid-cols-2 gap-12">
        <div className="h-[500px] bg-gray-200 rounded-3xl" />
        <div className="space-y-6">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-10 w-3/4 bg-gray-200 rounded" />
          <div className="h-20 w-full bg-gray-200 rounded" />
          <div className="h-12 w-1/2 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 gap-4">
             <div className="h-24 bg-gray-200 rounded-xl" />
             <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}