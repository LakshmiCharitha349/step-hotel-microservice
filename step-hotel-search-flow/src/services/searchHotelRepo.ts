import { Collection, ObjectId } from "mongodb";
import { deleteValue, getValue, setValueToRedis } from "./redis_client.ts";

export interface Hotels {
  name: string,
  city: string,
  totalRooms: number,
  availableRooms: number
}

interface Hotel {
  name: string, city: string, totalRooms: number
}

export class SearchHotelsRepo {
  #hotels: Collection<Hotels>;

  constructor(hotels: Collection<Hotels>) {
    this.#hotels = hotels;
  }

  async searchHotel(searchedcity: string) {
    const cachedHotel = await getValue(searchedcity);
    if (cachedHotel) {
      console.log("Cached Hit");
      return JSON.parse(cachedHotel)
    };

    console.log("Cached Miss");
    const hotel = await this.#hotels.find({ city: searchedcity }).toArray()
    if (hotel.length) setValueToRedis(searchedcity, JSON.stringify(hotel))
    return hotel;
  }

  createHotel(hotel: Hotel) {
    const newHotel = { ...hotel, availableRooms: hotel.totalRooms };
    this.#hotels.insertOne(newHotel);
    deleteValue(hotel.city);
    return { success: true };
  }

  async allocateRooms({ rooms, hotel_id }: { rooms: number, hotel_id: string }) {
    const hotel = await this.#hotels.findOne({ _id: new ObjectId(hotel_id) });

    if (!hotel) return { success: false };

    this.#hotels.updateOne({ _id: new ObjectId(hotel_id) }, { $set: { availableRooms: hotel.availableRooms - rooms } })
    deleteValue(hotel.city);
    return { success: true };
  }
}