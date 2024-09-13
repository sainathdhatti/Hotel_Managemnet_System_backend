import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingsService } from 'src/bookings/bookings.service';
import { FinalBillingService } from 'src/final_billing/final_billing.service';

@Injectable()
export class ReceptionistService {
    constructor(
       private readonly bookingService: BookingsService,
       private readonly finalBillingService: FinalBillingService,
      ) {}
    
      async getAllBilling() {
        return this.finalBillingService.getAllFinalBillings();
      }
    

      async getAllBookings() {
          return this.bookingService.getAllBookings();
      }
}
