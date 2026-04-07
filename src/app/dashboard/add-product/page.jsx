"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AddProductPage() {
  const [images, setImages] = useState([""]);
  const [loading, setLoading] = useState(false);

  const categoriesData = {
    Electronics: ["Phones", "Laptops", "Accessories"],
    Fashion: ["Men", "Women", "Kids"],
    "Home & Living": ["Furniture", "Decor", "Kitchen"],
    Beauty: ["Skincare", "Makeup", "Haircare"],
    Sports: ["Fitness", "Outdoor", "Equipment"],
    Automotive: ["Car Accessories", "Motorbike", "Tools"],
    Gaming: ["Consoles", "Games", "Accessories"],
    Grocery: ["Snacks", "Beverages", "Daily Essentials"],
    Books: ["Fiction", "Non-fiction", "Educational"],
  };

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title: e.target.title.value,
      description: e.target.description.value,
      price: Number(e.target.price.value),
      discountPercentage: Number(e.target.discount.value || 0),
      brand: e.target.brand.value,
      weight: e.target.weight.value,
      warrantyInformation: e.target.warranty.value,
      shippingInformation: e.target.shipping.value,
      availabilityStatus: e.target.availability.value,
      returnPolicy: e.target.returnPolicy.value,
      category,
      subCategory,
      images: images.filter((img) => img !== ""),
      createdAt: new Date(),
    };

    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      toast.success("Product added successfully ");

      // reset form
      e.target.reset();
      setImages([""]);
      setCategory("");
      setSubCategory("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-3xl mx-auto">

      <h2 className="text-sm tracking-widest uppercase mb-6">
        Add Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          type="text"
          placeholder="Product Name"
          className="w-full border border-gray-300 px-4 py-2 text-sm rounded-lg focus:ring-2 focus:ring-black outline-none"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border border-gray-300 px-4 py-2 text-sm rounded-lg focus:ring-2 focus:ring-black outline-none"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("");
            }}
            className="border border-gray-300 px-4 py-2 text-sm rounded-lg"
            required
          >
            <option value="">Select Category</option>
            {Object.keys(categoriesData).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="border border-gray-300 px-4 py-2 text-sm rounded-lg"
            disabled={!category}
            required
          >
            <option value="">Select Subcategory</option>
            {category &&
              categoriesData[category].map((sub) => (
                <option key={sub}>{sub}</option>
              ))}
          </select>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            placeholder="Price"
            className="border border-gray-300 px-4 py-2 text-sm rounded-lg"
            required
          />

          <input
            name="discount"
            type="number"
            placeholder="Discount %"
            className="border border-gray-300 px-4 py-2 text-sm rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="brand"
            type="text"
            placeholder="Brand"
            className="border border-gray-300 px-4 py-2 text-sm rounded-lg"
          />

          <input
            name="weight"
            type="number"
            placeholder="Weight"
            className="border border-gray-300 px-4 py-2 text-sm rounded-lg"
          />
        </div>

        <input
          name="warranty"
          type="text"
          placeholder="Warranty Information"
          className="w-full border border-gray-300 px-4 py-2 text-sm rounded-lg"
        />

        <input
          name="shipping"
          type="text"
          placeholder="Shipping Information"
          className="w-full border border-gray-300 px-4 py-2 text-sm rounded-lg"
        />

        <input
          name="availability"
          type="text"
          placeholder="Availability Status"
          className="w-full border border-gray-300 px-4 py-2 text-sm rounded-lg"
        />

        <input
          name="returnPolicy"
          type="text"
          placeholder="Return Policy"
          className="w-full border border-gray-300 px-4 py-2 text-sm rounded-lg"
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
              className="w-full border border-gray-300 px-4 py-2 text-sm rounded-lg"
            />
          ))}

          {images.length < 5 && (
            <button
              type="button"
              onClick={addImageField}
              className="text-xs border px-3 py-1 tracking-widest uppercase hover:bg-black hover:text-white transition"
            >
              + Add Image
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full border border-black px-6 py-2 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Saving..." : "Save Product"}
        </button>

      </form>
    </div>
  );
}