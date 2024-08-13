import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Room } from 'src/rooms/rooms.entity';
import { UserEntity } from 'src/user/user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { BookingsController } from './booking.controller';
import { BookingsService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Room, UserEntity]),CloudinaryModule],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports:[BookingsService]
})
export class BookingsModule {}
