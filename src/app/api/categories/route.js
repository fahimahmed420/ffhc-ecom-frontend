import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode"); 
    // mode = "home" | "full"

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const result = await db.collection("products").aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).toArray();

    const categories = result
      .filter((c) => c._id)
      .map((item) => ({
        name: item._id,
        count: item.count,
      }));

    // total count for "All"
    const total = categories.reduce((sum, c) => sum + c.count, 0);

    // ===============================
    // 🏠 HOME MODE (NO "All")
    // ===============================
    if (mode === "home") {
      const fixedOrder = [
        "Glamour & Beauty",
        "Intimate & Personal Care",
        "Auto Parts",
        "Fashion",
        "Tools & Hardware",
        "Stationery",
        "Mother & Baby",
        "Travel & Accessories",
        "Home & kitchen",
      ];

      const ordered = fixedOrder
        .map((name) => {
          const found = categories.find((c) => c.name === name);
          return found || { name, count: 0 };
        })
        .filter(Boolean);

      return Response.json({
        categories: ordered,
      });
    }

    // ===============================
    // 📦 FULL MODE (WITH "All")
    // ===============================
    return Response.json({
      categories: [
        { name: "All", count: total },
        ...categories,
      ],
    });

  } catch (err) {
    console.error("Category API error:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}