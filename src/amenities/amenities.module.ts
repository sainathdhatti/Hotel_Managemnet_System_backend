import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amenities } from './amenities.entity';
import { AmenitiesController } from './amenities.controller';
import { AmenitiesService } from './amenities.service';

@Module({imports:[TypeOrmModule.forFeature([Amenities])],
    controllers: [AmenitiesController],
  providers: [AmenitiesService],
})
export class AmenitiesModule {}
