import {Hono} from "hono";
import {logger} from "hono/logger";
import { SearchHotelsRepo } from "./services/searchHotelRepo.ts";
type HonoArgs = {searchHotels : SearchHotelsRepo}

export const createApp = (searchHotels : SearchHotelsRepo) => {
  const app = new Hono<{Variables : HonoArgs}>();

  app.use(logger());
  app.use((ctx , next) => {
    ctx.set("search-hotels-repo", searchHotels);
    return next();
  })

  app.get("api/search/hotels" , async (c : Context) => {
    const hotelRepo = c.get("search-hotels-repo");
    const { city } = c.req.query();

    const hotels = await hotelRepo.searchHotel(city);

    return c.json(hotels);
  })

  app.post("api/search/create-hotel" , async (c : Context) => {
    const hotelRepo = c.get("search-hotels-repo");
    const hotelDetails = await c.req.json();
    
    const { success } = await hotelRepo.createHotel(hotelDetails);
    
    return c.json(success);
  })
  
  app.post("api/search/allocate-rooms", async (c: Context) => {
    const body = await c.req.json();
    const hotelRepo = c.get("search-hotels-repo");

    const {success} = await hotelRepo.allocateRooms(body);

    return c.json(success);
  }) 

  return app;
}