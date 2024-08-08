import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createRoomCategory(
    createRoomCategoryDto: CreateRoomCategoryDto,
    image: Express.Multer.File,
  ){
    const uploadResult = await this.cloudinaryService.uploadFile(image);
  
    const roomCategory = new RoomCategories();
    roomCategory.name = createRoomCategoryDto.name;
    roomCategory.imageUrl = uploadResult.url;
    roomCategory.noOfChildren = Number(createRoomCategoryDto.noOfChildren) || 0;
    roomCategory.noOfAdults = Number(createRoomCategoryDto.noOfAdults) || 0;
    roomCategory.price = Number(createRoomCategoryDto.price) || 0;
    roomCategory.description = createRoomCategoryDto.description || null;
  
    // Convert amenitiesIds to an array of numbers
    const amenitiesIds = typeof createRoomCategoryDto.amenitiesIds === 'string'
      ? JSON.parse(createRoomCategoryDto.amenitiesIds).map(id => Number(id))
      : Array.isArray(createRoomCategoryDto.amenitiesIds)
      ? createRoomCategoryDto.amenitiesIds.map(id => Number(id))
      : [];
  
    console.log('Converted amenitiesIds:', amenitiesIds);
    console.log('Create DTO:', createRoomCategoryDto);
  
    // Fetch amenities by IDs and assign to roomCategory
    roomCategory.amenities = await this.amenitiesRepository.find({
      where: { id: In(amenitiesIds) },
    });
  
    return this.roomCategoriesRepository.save(roomCategory);
  }
  
  async findAllRoomCategories() {
    return this.roomCategoriesRepository.find({ relations: ['amenities'] });
  }

  async findOneRoomCategory(id: number) {
    return this.roomCategoriesRepository.findOne({where:{id},relations:['amenities']});
  }
  async updateRoomCategory(
    id: number,
    updateRoomCategoryDto: UpdateRoomCategoryDto,
    image?: Express.Multer.File,
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
    if (updateRoomCategoryDto.name) roomCategory.name = updateRoomCategoryDto.name;
    if (updateRoomCategoryDto.noOfChildren) roomCategory.noOfChildren = +updateRoomCategoryDto.noOfChildren;
    if (updateRoomCategoryDto.noOfAdults) roomCategory.noOfAdults = +updateRoomCategoryDto.noOfAdults;
    if (updateRoomCategoryDto.price) roomCategory.price = +updateRoomCategoryDto.price;
    if (updateRoomCategoryDto.description) roomCategory.description = updateRoomCategoryDto.description;
  
    // Handle image upload if a new image is provided
    if (image) {
      const uploadResult = await this.cloudinaryService.uploadFile(image);
      roomCategory.imageUrl = uploadResult.url;
    }
  
    // Update amenities if provided
    if (updateRoomCategoryDto.amenitiesIds) {
      let amenitiesIds: number[] = [];
      
      try {
        // Parse stringified array or use array directly
        amenitiesIds = Array.isArray(updateRoomCategoryDto.amenitiesIds)
          ? updateRoomCategoryDto.amenitiesIds.map(id => +id)
          : JSON.parse(updateRoomCategoryDto.amenitiesIds).map(id => +id);
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
    return "Room category deleted successfully"
    
  }
}
