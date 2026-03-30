"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">

      {/* Hero */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          About Us
        </motion.h1>

        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Your trusted destination for affordable, high-quality products sourced directly from China — bringing the world closer to you.
        </p>
      </div>

      {/* Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We started with a simple idea — make global products accessible to everyone. By sourcing directly from China, we cut out unnecessary middlemen and deliver high-quality items at competitive prices.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From everyday essentials to unique finds, our platform offers a wide range of products across multiple categories — all in one place.
          </p>
        </div>

        <div className="bg-gray-100 h-[300px] rounded-xl flex items-center justify-center">
          <span className="text-gray-400">Image Placeholder</span>
        </div>
      </div>

      {/* What We Offer */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          What We Offer
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="p-6 border rounded-xl bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Wide Variety</h3>
            <p className="text-gray-600 text-sm">
              Electronics, fashion, home essentials, gadgets, and more — all sourced directly from China.
            </p>
          </div>

          <div className="p-6 border rounded-xl bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Affordable Prices</h3>
            <p className="text-gray-600 text-sm">
              We eliminate unnecessary costs so you get the best deals without compromising quality.
            </p>
          </div>

          <div className="p-6 border rounded-xl bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Reliable Shipping</h3>
            <p className="text-gray-600 text-sm">
              Fast and secure shipping with clear tracking — bringing products right to your doorstep.
            </p>
          </div>

        </div>
      </div>

      {/* Mission */}
      <div className="bg-black text-white p-10 rounded-2xl text-center mb-20">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="max-w-2xl mx-auto text-gray-300">
          To simplify global shopping by connecting customers with quality products from China, while ensuring affordability, transparency, and trust in every purchase.
        </p>
      </div>

      {/* Why Choose Us */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl">
            <p className="font-semibold mb-2">✔ Direct Sourcing</p>
            <p className="text-gray-600 text-sm">
              Products come straight from manufacturers in China.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <p className="font-semibold mb-2">✔ Quality Assurance</p>
            <p className="text-gray-600 text-sm">
              Every product goes through quality checks before listing.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <p className="font-semibold mb-2">✔ Secure Shopping</p>
            <p className="text-gray-600 text-sm">
              Safe payments and reliable service you can trust.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <p className="font-semibold mb-2">✔ Customer Support</p>
            <p className="text-gray-600 text-sm">
              Dedicated support to help you anytime.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Start Shopping Today
        </h2>
        <p className="text-gray-600 mb-6">
          Explore thousands of products at unbeatable prices.
        </p>

        <Link href="/collections">
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Browse Products
          </button>
        </Link>
      </div>

    </section>
  );
}