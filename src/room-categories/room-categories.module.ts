import { Module } from '@nestjs/common';
import { RoomCategoriesService } from './room-categories.service';
import { RoomCategoriesController } from './room-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomCategories } from './room-categories.entity';
import { Amenities } from 'src/amenities/amenities.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';

@Module({
  imports: [TypeOrmModule.forFeature([RoomCategories, Amenities])],
  providers: [RoomCategoriesService, CloudinaryService, CloudinaryProvider],
  controllers: [RoomCategoriesController],
  exports:[RoomCategoriesService]
})
export class RoomCategoriesModule {}
