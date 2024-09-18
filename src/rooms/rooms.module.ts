import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './rooms.entity';
import { RoomCategories } from 'src/room-categories/room-categories.entity'; 
import { Booking } from 'src/bookings/bookings.Entity';
import { BookingsModule } from 'src/bookings/bookings.module';


@Module({
  imports:[TypeOrmModule.forFeature([Room,RoomCategories])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports:[RoomsService]
})
export class RoomsModule {}
