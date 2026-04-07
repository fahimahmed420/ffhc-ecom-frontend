import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db("ecommerce");

    // 1️⃣ Get main product
    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // 2️⃣ Get related products (same category)
    const related = await db
      .collection("products")
      .find({
        category: product.category,
        _id: { $ne: product._id },
      })
      .limit(4)
      .toArray();

    return Response.json({
      product: {
        ...product,
        _id: product._id.toString(),
      },
      related: related.map((p) => ({
        ...p,
        _id: p._id.toString(),
      })),
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}