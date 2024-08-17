import { Controller,Post, Get, Patch,Body,Delete,Param,NotFoundException,ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { HotelDetailsService } from './hotel_details.service';
import {createHotel_DetailsDto } from './dtos/createhotel_details.dto';
import { updateHotel_DetailsDto } from './dtos/updatehotel_details.dto';

@Controller('hotel-details')
export class HotelDetailsController {
    constructor(private hoteldetailsService:HotelDetailsService){}

    @Get()
    async getAllhotelDetails(){
        return await this.hoteldetailsService.getAllhotelDetails();
    }

    @Post()
    @UsePipes(new ValidationPipe)
    async createhotelDetails(@Body() hoteldetails:createHotel_DetailsDto){
        return await this.hoteldetailsService.createhotelDetails(hoteldetails);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe)
    async updatehotelDetails(@Param('id',ParseIntPipe)id:number, @Body() hotelDetails:updateHotel_DetailsDto){
        const findhotel=await this.hoteldetailsService.updatehotelDetails(id,hotelDetails);
        if(!findhotel){
            return new NotFoundException('Details not found.');
        }
        else{
            return findhotel
        }
    }

    @Delete(':id')
    async deletehotelDetails(@Param('id',ParseIntPipe) id:number){
        const findhotel=await this.hoteldetailsService.deletehotelDetails(id)
        if(!findhotel){
            return new NotFoundException('Details not found.')
        }
        else{
            return findhotel
        }
    }
}
