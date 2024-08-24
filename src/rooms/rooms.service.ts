import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room} from './rooms.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { RoomCategories } from 'src/room-categories/room-categories.entity';


@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,

    @InjectRepository(RoomCategories)
    private readonly roomCategoriesRepository: Repository<RoomCategories>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = new Room();
    room.roomNumber = createRoomDto.roomNumber;

    // Find and assign the room category
    const roomCategory = await this.roomCategoriesRepository.findOne({
      where: { id: createRoomDto.roomCategoryId },
    });

    if (!roomCategory) {
      throw new NotFoundException(`Room category with ID ${createRoomDto.roomCategoryId} not found`);
    }

    room.roomCategory = roomCategory;

    return this.roomsRepository.save(room);
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    if (updateRoomDto.roomNumber !== undefined) {
      room.roomNumber = updateRoomDto.roomNumber;
    }

    if (updateRoomDto.roomCategoryId !== undefined) {
      const roomCategory = await this.roomCategoriesRepository.findOne({
        where: { id: updateRoomDto.roomCategoryId },
      });

      if (!roomCategory) {
        throw new NotFoundException(`Room category with ID ${updateRoomDto.roomCategoryId} not found`);
      }

      room.roomCategory = roomCategory;
    }

    return this.roomsRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomsRepository.find({ relations: ['roomCategory'] });
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: ['roomCategory'],
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async remove(id: number): Promise<string> {
    const room = await this.roomsRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    await this.roomsRepository.remove(room);
    return 'Room deleted successfully';
  }

  async findAllRoomsByCategory(categoryId: number): Promise<Room[]> {
    return this.roomsRepository.find({
      where: {
        roomCategory: { id: categoryId },
        // status: status, // Ensure status matches the type defined in RoomStatus enum
      },
      relations: ['roomCategory'], // Include this if you need category details as well
    });
 
  }  
}
