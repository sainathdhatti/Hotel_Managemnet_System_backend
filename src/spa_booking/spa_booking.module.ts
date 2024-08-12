import { Module } from '@nestjs/common';
import { SpaBookingController } from './spa_booking.controller';
import { SpaBookingService } from './spa_booking.service';

@Module({
  controllers: [SpaBookingController],
  providers: [SpaBookingService]
})
export class SpaBookingModule {}
