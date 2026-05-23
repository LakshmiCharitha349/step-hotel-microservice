import { verify } from "hono/jwt";
import { Context } from "node:vm";
import { pushUpdateStatus as pushUpdateStatus } from "./redis_client.ts";
import { Context } from "hono";

const getUserId = async (context: Context) => {
  const token = context.req.header("Authorization").split(" ")[1];

  const jwtSecret = Deno.env.get("JWT_SECRET");

  if (!jwtSecret) {
    return false;
  }

  return (await verify(
    token,
    jwtSecret,
    'HS512'
  )).sub

}


export const bookingHandler = async (context: Context) => {
  const req = await context.req.json();
  const bookingsRepo = context.get("bookingsRepo");
  const userId = await getUserId(context);

  if (!userId) {
    return context.json({ success: false });
  }

  const id = await bookingsRepo.bookHotel(userId, req.hotel_id, req.rooms); 
  if (!id) {
    return context.json({ success: false });
  }

  await pushUpdateStatus(id);
  return context.json({ success: true, id });
}

export const listBookingsHandler = async (context: Context) => {
  const bookingsRepo = context.get("bookingsRepo");
  const userId = await getUserId(context);

  if (!userId) {
    return context.json({ success: false });
  }
  const bookings = await bookingsRepo.listBookings(userId);
  return context.json({ success: true, bookings });

}

export const pdfGeneratorHandler = async(context: Context) => {
  const bookingId = context.req.param("id");
  const bookingsRepo = context.get("bookingsRepo");

  const booking = await bookingsRepo.getPdf(bookingId)
  return context.json({ success: true, booking })
}

export const updateStatusHandler = async (context: Context) => {
  const bookingId = context.req.param("id");
  const bookingsRepo = context.get("bookingsRepo");

 const res = await bookingsRepo.updateBookingStatus(bookingId);
  
 return context.json({ success: true });
}

