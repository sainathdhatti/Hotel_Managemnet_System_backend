import { Controller, Get, NotFoundException, Param, ParseIntPipe, UsePipes, ValidationPipe, Body, Post, Patch, Delete } from '@nestjs/common';
import { SpaBookingService } from './spa_booking.service';
import { CreateSpaBookingDto } from './dtos/createspa_booking.dto';
import { updateSpaBookingBySpaDto } from './dtos/updatespa_bookingByStaff.dto';

@Controller('spa_bookings')
export class SpaBookingController {
    constructor(private readonly spabookingService:SpaBookingService){}

    @Get()
    async getAllSpaBookings(){
        return await this.spabookingService.getAllSpaBookings()
    }

    @Get()
    async getSpaBookingsById(@Param('id',ParseIntPipe)id:number){
        const findspabooking=await this.spabookingService.getSpaBookingsById(id)
        if(!findspabooking){
            throw new NotFoundException('Booking Not Found')
        }
        return findspabooking
    }

    @Get('users/:userId')
    @UsePipes(new ValidationPipe())
    async getBookingsByCustomer(@Param('userId',ParseIntPipe)userId:number) {
        return await this.spabookingService.getBookingsByCustomerId(userId);
    }

    @Post()
    async createSpaBooking(@Body() createBooking:CreateSpaBookingDto){
          return await this.spabookingService.createSpaBooking(createBooking)
    }

    @Patch(':id')
    async updateSpaBookingById(@Param('id', ParseIntPipe) id: number, @Body() updateSpaDetails: updateSpaBookingBySpaDto) {
      return await this.spabookingService.updateSpaBookingById(id, updateSpaDetails);
    }

    @Delete(':id')
    async deleteSpaBooking(@Param('id',ParseIntPipe)id:number){
        return await this.spabookingService.deleteSpaBooking(id)
    }
}
