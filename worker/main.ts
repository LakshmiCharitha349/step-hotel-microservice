import { createClient } from 'redis';
import { MongoClient, ObjectId } from "mongodb";
console.log(Deno.env.get("REDIS_URL") );
console.log("+".repeat(100))

const client = createClient({
  url: Deno.env.get("REDIS_URL") || 'redis://localhost:6380'
});

await client.connect();

interface Bookings {
  userId: string,
  hotel_id: string,
  rooms: number
  reciept_status: string
}


const createMongoDb = async () => {
  const MONGO_URI: string = Deno.env.get("MONGO_URL") || "mongodb://localhost:27017";
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db("hotelBookings");
  return db.collection<Bookings>("bookings");
}

const connection = await createMongoDb();

while (true) {
  const res = await client.blPop('pdf-generation', 1);

  const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));
  if (res?.element.startsWith("update-status")) {
    const id = res.element.split("-")[2]
    await delay(10000);
    await connection.updateOne({ _id: new ObjectId(id) }, { $set: { reciept_status: "generated" } });
  }
}

