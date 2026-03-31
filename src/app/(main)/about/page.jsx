"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const cardClass =
  "border border-gray-200 p-6 bg-white transition-all duration-300 hover:shadow-sm";

export default function AboutPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      {/* Hero */}
      <div className="text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl tracking-widest uppercase mb-4"
        >
          About Us
        </motion.h1>

        <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Your trusted destination for affordable, high-quality products sourced
          directly from China.
        </p>
      </div>

      {/* Story */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
        <div>
          <h2 className="text-sm tracking-widest uppercase mb-4">Our Story</h2>

          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            We started with a simple idea — make global products accessible to
            everyone by removing unnecessary middlemen.
          </p>

          <p className="text-sm text-gray-500 leading-relaxed">
            From everyday essentials to unique finds, we bring a wide range of
            products directly from trusted suppliers.
          </p>
        </div>

        <div className="relative border border-gray-200 h-[300px] overflow-hidden">
          <Image
            src="/Ffh china logo.png"
            alt="About us"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* What We Offer */}
      <div className="mb-20">
        <h2 className="text-sm tracking-widest uppercase text-center mb-10">
          What We Offer
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className={cardClass}>
            <h3 className="text-sm tracking-widest mb-2 uppercase">
              Wide Variety
            </h3>
            <p className="text-sm text-gray-500">
              Electronics, fashion, home essentials, and more — all in one
              place.
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-sm tracking-widest mb-2 uppercase">
              Affordable Prices
            </h3>
            <p className="text-sm text-gray-500">
              We reduce extra costs to give you the best value for money.
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-sm tracking-widest mb-2 uppercase">
              Reliable Shipping
            </h3>
            <p className="text-sm text-gray-500">
              Fast, secure delivery with tracking to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Mission (aligned minimal theme instead of black block) */}
      <div className="border border-gray-200 p-10 text-center mb-20">
        <h2 className="text-sm tracking-widest uppercase mb-4">Our Mission</h2>

        <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
          To simplify global shopping by connecting customers with quality
          products while ensuring affordability, transparency, and trust.
        </p>
      </div>

      {/* Why Choose Us */}
      <div className="mb-20">
        <h2 className="text-sm tracking-widest uppercase text-center mb-10">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={cardClass}>
            <p className="font-medium mb-2">✔ Direct Sourcing</p>
            <p className="text-sm text-gray-500">
              Products come straight from manufacturers.
            </p>
          </div>

          <div className={cardClass}>
            <p className="font-medium mb-2">✔ Quality Assurance</p>
            <p className="text-sm text-gray-500">
              Each product is checked before listing.
            </p>
          </div>

          <div className={cardClass}>
            <p className="font-medium mb-2">✔ Secure Shopping</p>
            <p className="text-sm text-gray-500">
              Safe payments and trusted service.
            </p>
          </div>

          <div className={cardClass}>
            <p className="font-medium mb-2">✔ Customer Support</p>
            <p className="text-sm text-gray-500">
              Dedicated support whenever you need help.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-sm tracking-widest uppercase mb-4">
          Start Shopping Today
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Explore thousands of products at unbeatable prices.
        </p>

        <Link href="/collections">
          <button className="border border-black px-6 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition">
            Browse Products
          </button>
        </Link>
      </div>
    </section>
  );
}
