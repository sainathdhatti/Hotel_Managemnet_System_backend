import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel_Details } from './hotel_details.Entity';
import { Repository } from 'typeorm';
import { createHotel_DetailsDto } from './dtos/createhotel_details.dto';
import { updateHotel_DetailsDto } from './dtos/updatehotel_details.dto';

@Injectable()
export class HotelDetailsService {
    constructor(
        @InjectRepository(Hotel_Details) private readonly hoteldetailRepo:Repository<Hotel_Details>,
    ){}

    async getAllhotelDetails(){
        return await this.hoteldetailRepo.find()
    }

    async gethotelDetailsById(id:number){
        return await this.hoteldetailRepo.findOneBy({id})
    }

    async createhotelDetails(hoteldetails:createHotel_DetailsDto){
        return await this.hoteldetailRepo.save(hoteldetails)
    }

    async updatehotelDetails(id:number, hoteldetail:updateHotel_DetailsDto){
        const findhoteldetail=await this.hoteldetailRepo.findOneBy({id})
        if(findhoteldetail){
            const updatehoteldetail={...findhoteldetail, ...hoteldetail}
            return await this.hoteldetailRepo.save(updatehoteldetail);
        }
    }


    async deletehotelDetails(id:number){
        const findhotelDetail=await this.hoteldetailRepo.findOneBy({id})
        if(findhotelDetail){
           return await this.hoteldetailRepo.remove(findhotelDetail)
        }
    }
}
