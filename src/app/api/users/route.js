import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      uid: body.uid,
    });

    if (!existingUser) {
      const newUser = {
        uid: body.uid,
        email: body.email,
        name: body.name || "",
        role: "user",
        createdAt: new Date(),
      };

      await usersCollection.insertOne(newUser);

      return Response.json(newUser);
    }

    return Response.json(existingUser);
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}