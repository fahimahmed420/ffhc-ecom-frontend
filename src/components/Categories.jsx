"use client";

import Image from "next/image";

export default function Categories() {
  return (
    <section className="bg-[#f7f7f7] px-6 md:px-12 py-16 md:py-24">

      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-xl md:text-2xl font-medium">
            Browse Archives
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Curated pathways for every expression.
          </p>
        </div>

        <span className="text-[10px] tracking-widest text-gray-500">
          ALL CATEGORIES
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT BIG */}
        <div className="relative h-[420px] md:h-[520px] overflow-hidden">
          <Image
            src="/categories/Men.jpg"
            alt="Menswear"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <p className="absolute bottom-6 left-6 text-white text-sm tracking-widest">
            MENSWEAR
          </p>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-2 grid gap-6">

          {/* Electronics */}
          <div className="relative h-[240px] overflow-hidden">
            <Image
              src="/categories/Electronics.jpg"
              alt="Electronics"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <p className="absolute bottom-6 left-6 text-white text-sm tracking-widest">
              ELECTRONICS
            </p>
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-2 gap-6">

            <div className="relative h-[240px] overflow-hidden">
              <Image
                src="/categories/Women.jpg"
                alt="Womenswear"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <p className="absolute bottom-6 left-6 text-white text-xs tracking-widest">
                WOMENSWEAR
              </p>
            </div>

            <div className="relative h-[240px] overflow-hidden">
              <Image
                src="/categories/Kids.jpg"
                alt="Kids"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <p className="absolute bottom-6 left-6 text-white text-xs tracking-widest">
                KIDS
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}