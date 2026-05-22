import { Hono } from "hono";
import {logger} from "hono/logger";
import { BookingsRepo } from "./repository/bookingsRepo.ts";
import { bookingHandler, listBookingsHandler } from "./handlers/bookingHandler.ts";

type HonoArgs = {
  "bookingsRepo" : BookingsRepo
}

export const createApp = (bookingsRepo:BookingsRepo) => {
  const app = new Hono<{ Variables: HonoArgs }>();
  
  app.use(logger());
   
  app.use("*", async (c,next) => {
    c.set("bookingsRepo",bookingsRepo);
    await next();
  })
   
  app.post("/api/bookings", bookingHandler);
  app.get("/api/bookings", listBookingsHandler);

  return app;
}