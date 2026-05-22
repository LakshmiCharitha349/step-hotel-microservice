import { Collection, ObjectId } from "mongodb";

export interface Hotels {
  name : string,
  city : string,
  totalRooms : number,
  availableRooms : number  
}

interface Hotel {
  name : string, city : string, totalRooms : number
}

export class SearchHotelsRepo {
  #hotels : Collection<Hotels>;

  constructor(hotels : Collection<Hotels>) {
    this.#hotels = hotels;
  }

  async searchHotel(searchedcity : string) {
    const hotel = this.#hotels.find({city : searchedcity})
    return await hotel.toArray();
  }

  createHotel(hotel : Hotel) {
    const newHotel = {...hotel, availableRooms : hotel.totalRooms };
    this.#hotels.insertOne(newHotel);

    return {success : true};
  }

  async allocateRooms({rooms, hotel_id} : {rooms : number, hotel_id : string}) {
    const hotel = await this.#hotels.findOne({_id : new ObjectId(hotel_id)});
    
    if(!hotel) return {success:false};
    
    this.#hotels.updateOne({_id : new ObjectId(hotel_id)}, {$set : {availableRooms : hotel.availableRooms - rooms}})
 
    return {success : true};
  }
}