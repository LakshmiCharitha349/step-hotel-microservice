import { Db } from "mongodb";

interface Bookings {
  userId: string,
  hotel_id: string,
  rooms: number
}

export class BookingsRepo {
  #bookings;

  constructor(db: Db) {
    this.#bookings = db.collection<Bookings>("bookings");
  }

  async bookHotel(userId:string,hotel_id:string,rooms:number) {
    console.log("userid :: "+ userId);
    const newBooking = {userId,hotel_id,rooms};
   const search_url = Deno.env.get("SEARCH_URL");
   
    const res = await fetch(`${search_url}`, {
      method:"POST",
      headers: {"content-type": "application/json"},
      body : JSON.stringify({rooms , hotel_id}),
      credentials:"include"
    }).then(res => res.json());
         
    if(!res) {
      return null;
    }

     const {insertedId} = await this.#bookings.insertOne(newBooking);
     return insertedId;
  }
 

  async listBookings(userId:string) {
    const userBookings = await this.#bookings.find({userId}).toArray();
    
    return userBookings.map(b => ({id: b._id, userId:b.userId, hotel_id:b.hotel_id,rooms:b.rooms}));
  }
  
}