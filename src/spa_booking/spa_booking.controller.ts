import { Controller, Get, NotFoundException, Param, ParseIntPipe, UsePipes, ValidationPipe, Body, Post, Patch } from '@nestjs/common';
import { SpaBookingService } from './spa_booking.service';
import { CreateSpaBookingDto } from './dtos/createspa_booking.dto';
import { updateSpaBookingDto } from './dtos/updatespa_booking.dto';
import { updateFamily_MemberDto } from 'src/family_members/dtos/updatefamily_members.dto';

@Controller('spa_bookings')
export class SpaBookingController {
    constructor(private readonly spabookingService:SpaBookingService){}

    @Get()
    async getAllSpaBookings(){
        return await this.spabookingService.getAllSpaBookings()
    }

    @Get(':id')
    @UsePipes(new ValidationPipe())
    async getSpaBookingsById(@Param('id',ParseIntPipe)id:number){
        const findspabooking=await this.spabookingService.getSpaBookingsById(id)
        if(!findspabooking){
            throw new NotFoundException('Booking Not Found')
        }
        return findspabooking
    }

    @Get('/users/:userId')
    @UsePipes(new ValidationPipe())
    async getBookingsByCustomer(@Param('userId',ParseIntPipe) userId: number) {
        return await this.spabookingService.getBookingsByCustomerId(userId);
    }

    @Get(':id/users/:userId/family-members/:familymemberId')
    @UsePipes(new ValidationPipe())
    async getBookingByFamilyMember(
    @Param('familymemberId', ParseIntPipe) familymemberId: number,
    @Param('userId', ParseIntPipe) userId: number ) {
    return await this.spabookingService.getBookingByFamilyMember(userId,familymemberId);
  }

    @Post()
    async createSpaBooking(@Body() createBooking:CreateSpaBookingDto){
          return await this.spabookingService.createSpaBooking(createBooking)
    }

    @Patch('/users/:userId/family-members/:familymemberId')
    async updateBookingByFamilyMember(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('familymemberId', ParseIntPipe) familymemberId: number, @Body() updateSpaDetails:updateSpaBookingDto){
        return await this.updateBookingByFamilyMember(userId,familymemberId,updateSpaDetails)
    }

}
