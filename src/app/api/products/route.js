import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("ecommerce");

  const products = await db.collection("products").find().toArray();

  return Response.json(products);
}

export async function POST(req) {
  const product = await req.json();

  const client = await clientPromise;
  const db = client.db("ecommerce");

  const result = await db.collection("products").insertOne(product);

  return Response.json(result);
}