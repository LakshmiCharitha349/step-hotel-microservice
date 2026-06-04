import { Db, ObjectId } from "mongodb";

interface Bookings {
  userId: string,
  name: string,
  rooms: number
  reciept_status: string
}

export class BookingsRepo {
  #bookings;

  constructor(db: Db) {
    this.#bookings = db.collection<Bookings>("bookings");
  }

  async bookHotel(userId: string, name: string, rooms: number) {
    const newBooking = { userId, name, rooms, reciept_status: "Pending" };
    // const search_url = Deno.env.get("SEARCH_URL");

    // const res = await fetch(`${search_url}`, {
    //   method: "POST",
    //   headers: { "content-type": "application/json" },
    //   body: JSON.stringify({ rooms, hotel_id }),
    //   credentials: "include"
    // }).then(res => res.json());

    // if (!res) {
    //   return null;
    // }

    const { acknowledged } = await this.#bookings.insertOne(newBooking);
    return acknowledged;
  }


  async listBookings(userId: string) {
    const userBookings = await this.#bookings.find({ userId }).toArray();

    return userBookings.map(b => ({ id: b._id, userId: b.userId, hotel_id: b.hotel_id, rooms: b.rooms }));
  }

  async getPdf(id: string) {
    return await this.#bookings.findOne({ _id: new ObjectId(id) });
  }

  async updateBookingStatus(id:string) {
    return (await this.#bookings.updateOne({ _id: new ObjectId(id) }, { $set: { reciept_status: "generated" } })).modifiedCount;
  }

}