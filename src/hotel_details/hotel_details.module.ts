import { Module } from '@nestjs/common';
import { HotelDetailsController } from './hotel_details.controller';
import { HotelDetailsService } from './hotel_details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel_Details } from './hotel_details.Entity';

@Module({
  imports:[TypeOrmModule.forFeature([Hotel_Details])],
  controllers: [HotelDetailsController],
  providers: [HotelDetailsService]
})
export class HotelDetailsModule {}
