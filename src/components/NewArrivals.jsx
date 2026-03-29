"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NewArrivals() {
  const router = useRouter();

  const products = [
    { id: 1, name: "Structured Linen Tunic", price: "$240", img: "/new arrivals/h1.png" },
    { id: 2, name: "Pleated Wool Trouser", price: "$380", img: "/new arrivals/Accessoires.jpg" },
    { id: 3, name: "Heritage Silk Wrap", price: "$195", img: "/new arrivals/black-headphones-digital-device.jpg" },
    { id: 4, name: "Large Architecture Tote", price: "$1100", img: "/new arrivals/make-up-products.jpg" },
  ];

  return (
    <section className="px-6 md:px-12 py-20">
      <h2 className="text-2xl mb-12">New Arrivals</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        {products.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="group cursor-pointer"
          >
            {/* IMAGE CONTAINER (FIXED SIZE) */}
            <div
              onClick={() => router.push(`/product/${p.id}`)}
              className="relative w-full aspect-[4/4] overflow-hidden bg-gray-100"
            >
              <Image
                src={p.img}
                alt={p.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              {/* subtle dark overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

              {/* ADD TO CART */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p);
                }}
                className="absolute bottom-0 left-0 w-full 
                bg-black text-white py-2 text-[11px] tracking-widest 
                translate-y-full group-hover:translate-y-0 
                transition duration-300"
              >
                ADD TO CART
              </button>
            </div>

            {/* TEXT */}
            <div className="mt-4 space-y-1">
              <h3 className="text-sm leading-tight">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}