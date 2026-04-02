import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ecommerce");

    await db.command({ ping: 1 });

    return Response.json({
      message: "MongoDB connected successfully!",
    });
  } catch (error) {
    return Response.json({ error: error.message });
  }
}