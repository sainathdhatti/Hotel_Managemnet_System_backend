import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch } from '@nestjs/common';
import { ReceptionistService } from './receptionist.service';
import { BookingStatus } from 'src/bookings/bookings.Entity';

@Controller('receptionist')
export class ReceptionistController {
    constructor(private readonly receptionistService: ReceptionistService) {}

    @Get('final-billing')
    async getAllBilling() {
      return this.receptionistService.getAllBilling();
    }

    @Get('bookings')
    async getAllBookings() {
        return this.receptionistService.getAllBookings();
    }

}
