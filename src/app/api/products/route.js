import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ecommerce");

    const products = await db.collection("products").find().toArray();

    // ✅ Convert ObjectId to string HERE
    const formatted = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return Response.json(formatted);
  } catch (err) {
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const product = await req.json();

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const result = await db.collection("products").insertOne(product);

    return Response.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (err) {
    return Response.json({ error: "Failed to insert product" }, { status: 500 });
  }
}