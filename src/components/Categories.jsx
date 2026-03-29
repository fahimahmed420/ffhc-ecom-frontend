export default function Categories() {
  return (
    <section className="bg-[#f7f7f7] px-6 md:px-12 py-16 md:py-24">

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
        <div className="relative h-[420px] md:h-[520px]">
          <img src="/categories/Men.jpg" className="w-full h-full object-cover" />
          <p className="absolute bottom-6 left-6 text-white text-sm tracking-widest">
            MENSWEAR
          </p>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-2 grid gap-6">

          <div className="relative h-[240px]">
            <img src="/categories/Electronics.jpg" className="w-full h-full object-cover" />
            <p className="absolute bottom-6 left-6 text-white text-sm tracking-widest">
              ELECTRONICS
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative h-[240px]">
              <img src="/categories/Women.jpg" className="w-full h-full object-cover" />
              <p className="absolute bottom-6 left-6 text-white text-xs tracking-widest">
                WOMENSWEAR
              </p>
            </div>

            <div className="relative h-[240px]">
              <img src="/categories/Kids.jpg" className="w-full h-full object-cover" />
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