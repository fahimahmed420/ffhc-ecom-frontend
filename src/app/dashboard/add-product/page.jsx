"use client";

import { useEffect, useState } from "react";

export default function AddProductPage() {
  const [images, setImages] = useState([""]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // ✅ Fetch products and extract unique tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products?limit=100");
        const data = await res.json();

        const allTags = data.products.flatMap(product => product.tags);
        const uniqueTags = [...new Set(allTags)];

        setTags(uniqueTags);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };

    fetchTags();
  }, []);

  // ✅ Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const addImageField = () => {
    if (images.length < 5) {
      setImages([...images, ""]);
    }
  };

  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      title: e.target.title.value,
      description: e.target.description.value,
      price: e.target.price.value,
      discountPercentage: e.target.discount.value,
      brand: e.target.brand.value,
      weight: e.target.weight.value,
      warrantyInformation: e.target.warranty.value,
      shippingInformation: e.target.shipping.value,
      availabilityStatus: e.target.availability.value,
      returnPolicy: e.target.returnPolicy.value,
      tags: selectedTags,
      images: images.filter(img => img !== ""),
    };

    console.log(formData);
  };

  return (
    <div className="border border-gray-200 p-6 bg-white">
      <h2 className="text-sm tracking-widest uppercase mb-6">
        Add Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">

        {/* Title */}
        <input
          name="title"
          type="text"
          placeholder="Product Name"
          className="w-full border border-gray-300 px-4 py-2 text-sm outline-none"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border border-gray-300 px-4 py-2 text-sm outline-none"
          required
        />

        {/* ✅ Tags Selection */}
        <div>
          <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">
            Select Tags
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`border px-3 py-1 text-xs uppercase tracking-widest transition ${
                  selectedTags.includes(tag)
                    ? "bg-black text-white"
                    : "hover:bg-black hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Price + Discount */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            placeholder="Price"
            className="border border-gray-300 px-4 py-2 text-sm outline-none"
            required
          />

          <input
            name="discount"
            type="number"
            placeholder="Discount %"
            className="border border-gray-300 px-4 py-2 text-sm outline-none"
          />
        </div>

        {/* Brand + Weight */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="brand"
            type="text"
            placeholder="Brand"
            className="border border-gray-300 px-4 py-2 text-sm outline-none"
          />

          <input
            name="weight"
            type="number"
            placeholder="Weight"
            className="border border-gray-300 px-4 py-2 text-sm outline-none"
          />
        </div>

        {/* Warranty + Shipping */}
        <input
          name="warranty"
          type="text"
          placeholder="Warranty Information"
          className="w-full border border-gray-300 px-4 py-2 text-sm outline-none"
        />

        <input
          name="shipping"
          type="text"
          placeholder="Shipping Information"
          className="w-full border border-gray-300 px-4 py-2 text-sm outline-none"
        />

        {/* Availability */}
        <input
          name="availability"
          type="text"
          placeholder="Availability Status"
          className="w-full border border-gray-300 px-4 py-2 text-sm outline-none"
        />

        {/* Return Policy */}
        <input
          name="returnPolicy"
          type="text"
          placeholder="Return Policy"
          className="w-full border border-gray-300 px-4 py-2 text-sm outline-none"
        />

        {/* Images */}
        <div className="space-y-2">
          <p className="text-xs tracking-widest uppercase text-gray-500">
            Product Images (max 5)
          </p>

          {images.map((img, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Image URL ${index + 1}`}
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 text-sm outline-none"
            />
          ))}

          {images.length < 5 && (
            <button
              type="button"
              onClick={addImageField}
              className="text-xs border border-gray-300 px-3 py-1 tracking-widest uppercase hover:bg-black hover:text-white transition"
            >
              + Add Image
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="border border-black px-6 py-2 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition"
        >
          Save Product
        </button>

      </form>
    </div>
  );
}