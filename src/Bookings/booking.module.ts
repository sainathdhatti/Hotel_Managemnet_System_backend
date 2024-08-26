import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from 'src/rooms/rooms.entity';
import { UserEntity } from 'src/user/user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { BookingsService } from './booking.service';
import { RoomCategories } from 'src/room-categories/room-categories.entity';
import { BookingsController } from './bookings.controller';
import { Booking } from './bookings.Entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Room, UserEntity,RoomCategories]),CloudinaryModule],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports:[BookingsService]
})
export class BookingsModule {}

