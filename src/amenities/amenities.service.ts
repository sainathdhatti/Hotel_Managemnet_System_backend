import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amenities } from './amenities.entity';
import { CreateAmenitiesDto } from './dtos/create-amenities.dto';
import { UpdateAmenitiesDto } from './dtos/update-amenities.dto';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenities)
    private readonly amenitiesRepository: Repository<Amenities>,
  ) {}

  async createAmenities(createAmenitiesDto: CreateAmenitiesDto) {
    const amenities = this.amenitiesRepository.create(createAmenitiesDto);
    return this.amenitiesRepository.save(amenities);
  }

  async getAllAmenities() {
    return this.amenitiesRepository.find();
  }

  async findOneAmenity(id: number) {
    const amenities = await this.amenitiesRepository.findOne({ where: { id } });
    if (!amenities) {
      throw new NotFoundException(`Amenities with ID ${id} not found`);
    }
    return amenities;
  }

  async updateAmenity(id: number, updateAmenitiesDto: UpdateAmenitiesDto) {
    const amenities = await this.amenitiesRepository.findOne({ where: { id } });
    if (!amenities) {
      throw new NotFoundException(`Amenities with ID ${id} not found`);
    }
    await this.amenitiesRepository.update(id, updateAmenitiesDto);
    return this.findOneAmenity(id);
  }

  async removeAmenity(id: number) {
    const amenities = await this.amenitiesRepository.findOne({ where: { id } });
    if (!amenities) {
      throw new NotFoundException(`Amenities with ID ${id} not found`);
    } // ensure it exists
    await this.amenitiesRepository.delete(id);
    return "Amenity deleted succesfully"

  }
}
