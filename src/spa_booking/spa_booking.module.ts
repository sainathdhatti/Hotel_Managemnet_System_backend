import { Module } from '@nestjs/common';
import { SpaBookingController } from './spa_booking.controller';
import { SpaBookingService } from './spa_booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaBooking } from './spa_bookingEntity';
import { UserModule } from 'src/user/user.module';
import { SpaServiceModule } from 'src/spa_service/spa_service.module';
import { TimeSlotModule } from 'src/time_slot/time_slot.module';
import { StaffMembersModule } from 'src/staff_members/staff_members.module';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaBooking]),
    UserModule,
    SpaServiceModule,
    TimeSlotModule,
    StaffMembersModule,
    BookingsModule
  ],
  controllers: [SpaBookingController],
  providers: [SpaBookingService,],
  exports: [SpaBookingService],
})
export class SpaBookingModule {}
