// src/app/api/products/[id]/review/route.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req, context) {
  try {
    const params = await context.params;
    const id = params.id;

    console.log("Received Review for Product ID:", id);

    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid product ID" }), { status: 400 });
    }

    const { name, rating, comment, email } = await req.json();

    if (!name || !comment || !rating) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    // ✅ Make sure the product exists
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    const newReview = {
      name,
      email: email || "",
      rating,
      comment,
      date: new Date().toISOString(),
    };

    // ✅ Use updateOne instead of findOneAndUpdate to avoid undefined result.value issues
    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $push: { reviews: newReview } }
    );

    // ✅ Fetch the updated product to return reviews
    const updatedProduct = await db.collection("products").findOne({ _id: new ObjectId(id) });

    return new Response(
      JSON.stringify({ success: true, reviews: updatedProduct.reviews || [] }),
      { status: 200 }
    );
  } catch (err) {
    console.error("POST Review Error:", err);
    return new Response(JSON.stringify({ error: "Failed to add review" }), { status: 500 });
  }
}