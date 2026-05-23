import { createApp } from "./src/app.ts";
import {MongoClient} from "mongodb";
import { Hotels, SearchHotelsRepo } from "./src/services/searchHotelRepo.ts";

const createDb = () => {
  const mongoUrl = Deno.env.get("MONGO_URL")!;
  const client = new MongoClient(mongoUrl);
  const db = client.db("hotel-search-db");
  
  const hotels = db.collection<Hotels>("hotel-collection");

  return hotels
}

const main = () => {
  const hotels = createDb();
  const searchService = new SearchHotelsRepo(hotels);
  const app = createApp(searchService);
  Deno.serve({port : 3000},app.fetch);
}

main();
