import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

/* -------------------------
   CREATE / UPDATE USER
-------------------------- */
export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("ecommerce");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      uid: body.uid,
    });

    //  CREATE NEW USER
    if (!existingUser) {
      const newUser = {
        uid: body.uid,
        email: body.email,
        name: body.name || "",
        phone: "",
        address: "",
        photo: body.photo || "", //  FIXED
        role: "user",
        createdAt: new Date(),
      };

      await usersCollection.insertOne(newUser);
      return Response.json(newUser);
    }

    //  UPDATE EXISTING USER (important for Google photo)
    await usersCollection.updateOne(
      { uid: body.uid },
      {
        $set: {
          name: body.name || existingUser.name,
          photo: body.photo || existingUser.photo,
        },
      }
    );

    const updatedUser = await usersCollection.findOne({
      uid: body.uid,
    });

    return Response.json(updatedUser);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/* -------------------------
   GET USER
-------------------------- */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const user = await db.collection("users").findOne({ email });

    return Response.json(user || {});
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/* -------------------------
   UPDATE PROFILE
-------------------------- */
export async function PATCH(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("ecommerce");

    await db.collection("users").updateOne(
      { email: body.email },
      {
        $set: {
          name: body.name,
          phone: body.phone,
          address: body.address,
          photo: body.photo,
        },
      }
    );

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}