import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ===============================
// GET PRODUCTS
// ===============================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 0;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const category = searchParams.get("category");
    const sort = searchParams.get("sort"); // asc | desc
    const ids = searchParams.get("ids"); // 🛒 cart mode
    const search = searchParams.get("search"); // optional future use

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const collection = db.collection("products");

    // ===============================
    // 🛒 CART MODE (FETCH BY IDS)
    // ===============================
    if (ids) {
      const idsArray = ids
        .split(",")
        .filter(Boolean)
        .map((id) => {
          try {
            return new ObjectId(id);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const products = await collection
        .find({ _id: { $in: idsArray } })
        .toArray();

      const formatted = products.map((p) => ({
        ...p,
        _id: p._id.toString(),
      }));

      return Response.json({ products: formatted });
    }

    // ===============================
    // FILTER QUERY
    // ===============================
    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    // (optional future search)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // ===============================
    // SORTING
    // ===============================
    let sortOption = {};

    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    // ===============================
    // PAGINATION QUERY
    // ===============================
    const products = await collection
      .find(query)
      .sort(sortOption)
      .skip(page * limit)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(query);

    const formatted = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return Response.json({
      products: formatted,
      total,
      page,
      hasMore: page * limit + products.length < total,
    });
  } catch (err) {
    console.error("GET /products error:", err);

    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ===============================
// CREATE PRODUCT
// ===============================
export async function POST(req) {
  try {
    const body = await req.json();

    // ===============================
    // VALIDATION
    // ===============================
    if (!body.title || !body.price) {
      return Response.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const collection = db.collection("products");

    const newProduct = {
      title: body.title,
      price: Number(body.price),
      category: body.category || "General",
      images: Array.isArray(body.images) ? body.images : [],
      thumbnail:
        body.thumbnail ||
        (Array.isArray(body.images) && body.images.length > 0
          ? body.images[0]
          : ""),
      stock: body.stock || 0,
      rating: body.rating || 0,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newProduct);

    return Response.json({
      success: true,
      insertedId: result.insertedId.toString(),
    });
  } catch (err) {
    console.error("POST /products error:", err);

    return Response.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}