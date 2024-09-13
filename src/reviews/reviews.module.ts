import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module'; // Import UserModule
import { Review } from './reviews.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { BookingsModule } from 'src/bookings/bookings.module';
import { Booking } from 'src/bookings/bookings.Entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review,Booking])], // Include UserModule
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
