import { createApp } from "./src/app.ts";
import { MongoClient } from "mongodb";
import { BookingsRepo } from "./src/repository/bookingsRepo.ts";


const createMongoDb = async () => {
  const MONGO_URI: string = Deno.env.get("MONGO_URL") || "mongodb://localhost:27017";
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db("hotelBookings");
  return db;
}

const main = async () => {
  
  const db = await createMongoDb();
  const bookingsRepo = new BookingsRepo(db);
  const app = createApp(bookingsRepo);
  const PORT = Deno.env.get("PORT") || "8000";
  Deno.serve({port : +PORT }, app.fetch);
}

main();
