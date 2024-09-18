import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.Entity';
import { UserModule } from 'src/user/user.module';
import { RoomCategoriesModule } from 'src/room-categories/room-categories.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { Room } from 'src/rooms/rooms.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Booking,Room]),UserModule,RoomCategoriesModule,RoomsModule],
  controllers: [BookingsController],
  providers: [BookingsService,],
  exports:[BookingsService]
})
export class BookingsModule {}
