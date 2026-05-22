import { verify } from "hono/jwt";
import { Context } from "node:vm";

const getUserId = async (context : Context) => {
   const token = context.req.header("Authorization").split(" ")[1];
  
  const jwtSecret = Deno.env.get("JWT_SECRET");
  
  console.log("jwt secre" + jwtSecret);
  if(!jwtSecret) {
    return false;
  }

  return (await verify(
    token,
    jwtSecret,
    'HS512'
  )).sub

}

export const bookingHandler = async (context:Context) => {
  const req = await context.req.json();
  const bookingsRepo = context.get("bookingsRepo");
 const userId = await getUserId(context);

 console.log("jwt user ::" + userId);
  if(!userId) {
    return context.json({success: false});
  }

  const id = await bookingsRepo.bookHotel(userId, req.hotel_id,req.rooms);
   
  
  if(!id) {
    return context.json({success: false});
  }
  
  return context.json({success: true , id });
}

export const listBookingsHandler =async  (context: Context)  => {
  const bookingsRepo = context.get("bookingsRepo");
 const userId =await getUserId(context);
 
 if(!userId) {
   return context.json({success: false});
 }
 const bookings = await bookingsRepo.listBookings(userId);
 console.log("list ::" + bookings);
 return context.json({success: true , bookings });

}

