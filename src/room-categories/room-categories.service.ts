import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoomCategories } from './room-categories.entity';
import { Amenities } from 'src/amenities/amenities.entity';
import { CreateRoomCategoryDto } from './dtos/create-roomcategories.dto';
import { UpdateRoomCategoryDto } from './dtos/update-roomcategories.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class RoomCategoriesService {
  constructor(
    @InjectRepository(RoomCategories)
    private readonly roomCategoriesRepository: Repository<RoomCategories>,
    @InjectRepository(Amenities)
    private readonly amenitiesRepository: Repository<Amenities>,
  ) {}

  async createRoomCategory(createRoomCategoryDto: CreateRoomCategoryDto) {
    const roomCategory = new RoomCategories();
    roomCategory.name = createRoomCategoryDto.name;
    roomCategory.imageUrl = createRoomCategoryDto.imageUrl;
    roomCategory.noOfChildren = Number(createRoomCategoryDto.noOfChildren) || 0;
    roomCategory.noOfAdults = Number(createRoomCategoryDto.noOfAdults) || 0;
    roomCategory.price = Number(createRoomCategoryDto.price) || 0;
    roomCategory.description = createRoomCategoryDto.description || undefined;
  
    const amenitiesIds = 
      typeof createRoomCategoryDto.amenitiesIds === 'string'
        ? JSON.parse(createRoomCategoryDto.amenitiesIds).map((id) => Number(id))
        : Array.isArray(createRoomCategoryDto.amenitiesIds)
        ? createRoomCategoryDto.amenitiesIds.map((id) => Number(id))
        : [];
  
    console.log('Parsed amenities IDs:', amenitiesIds);
  
    roomCategory.amenities = await this.amenitiesRepository.find({
      where: { id: In(amenitiesIds) },
    });
  
    return this.roomCategoriesRepository.save(roomCategory);
  }
  

  async findAllRoomCategories() {
    return this.roomCategoriesRepository.find({ relations: ['amenities'] });
  }

  async findOneRoomCategory(id: number) {
    return this.roomCategoriesRepository.findOne({
      where: { id },
      relations: ['amenities'],
    });
  }
  async updateRoomCategory(
    id: number,
    updateRoomCategoryDto: UpdateRoomCategoryDto,
  ): Promise<RoomCategories> {
    // Fetch the existing room category with amenities
    const roomCategory = await this.roomCategoriesRepository.findOne({
      where: { id },
      relations: ['amenities'],
    });

    if (!roomCategory) {
      throw new NotFoundException(`Room category with id ${id} not found`);
    }

    // Update properties if provided
    if (updateRoomCategoryDto.name)
      roomCategory.name = updateRoomCategoryDto.name;
    if (updateRoomCategoryDto.noOfChildren)
      roomCategory.noOfChildren = +updateRoomCategoryDto.noOfChildren;
    if (updateRoomCategoryDto.noOfAdults)
      roomCategory.noOfAdults = +updateRoomCategoryDto.noOfAdults;
    if (updateRoomCategoryDto.price)
      roomCategory.price = +updateRoomCategoryDto.price;
    if (updateRoomCategoryDto.description)
      roomCategory.description = updateRoomCategoryDto.description;
    if (updateRoomCategoryDto.imageUrl)
      roomCategory.imageUrl = updateRoomCategoryDto.imageUrl;

    // Handle image upload if a new image is provided

    // Update amenities if provided
    if (updateRoomCategoryDto.amenitiesIds) {
      let amenitiesIds: number[] = [];

      try {
        // Parse stringified array or use array directly
        amenitiesIds = Array.isArray(updateRoomCategoryDto.amenitiesIds)
          ? updateRoomCategoryDto.amenitiesIds.map((id) => +id)
          : JSON.parse(updateRoomCategoryDto.amenitiesIds).map((id) => +id);
      } catch (error) {
        console.error('Error parsing amenitiesIds:', error);
      }

      console.log('Parsed Amenities IDs:', amenitiesIds);

      // Fetch amenities based on IDs
      const amenities = await this.amenitiesRepository.find({
        where: { id: In(amenitiesIds) },
      });

      console.log('Fetched Amenities:', amenities);

      // Assign amenities to room category
      roomCategory.amenities = amenities;
    }

    // Save the updated room category
    return this.roomCategoriesRepository.save(roomCategory);
  }

  async removeRoomCategory(id: number) {
    const roomCategory = await this.roomCategoriesRepository.findOne({
      where: { id },
      relations: ['amenities'],
    });

    if (!roomCategory) {
      throw new NotFoundException(`Room category with id ${id} not found`);
    }
    await this.roomCategoriesRepository.delete(id);
    return 'Room category deleted successfully';
  }
}
