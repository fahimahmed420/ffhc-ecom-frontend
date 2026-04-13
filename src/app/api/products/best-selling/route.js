import clientPromise from "@/lib/mongodb";

// ===============================
// GET BEST SELLING (TOP RATED)
// ===============================
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ecommerce");

    const products = await db.collection("products")
      .aggregate([
        // ⭐ Calculate avg rating
        {
          $addFields: {
            avgRating: {
              $cond: [
                { $gt: [{ $size: { $ifNull: ["$reviews", []] } }, 0] },
                { $avg: "$reviews.rating" },
                0,
              ],
            },
          },
        },

        // 🔥 Sort ALL products by rating
        { $sort: { avgRating: -1 } },

        // ✅ Take TOP 4 ONLY
        { $limit: 4 },
      ])
      .toArray();

    return Response.json({
      products: products.map((p) => ({
        ...p,
        _id: p._id.toString(),
      })),
    });

  } catch (err) {
    console.error("Best Selling API error:", err);

    return Response.json(
      { error: "Failed to fetch best selling products" },
      { status: 500 }
    );
  }
}