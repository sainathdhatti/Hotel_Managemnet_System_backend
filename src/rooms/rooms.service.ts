import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, RoomStatus } from './rooms.entity';
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
    room.status = createRoomDto.status || RoomStatus.AVAILABLE; // Use enum

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

    if (updateRoomDto.status !== undefined) {
      if (!Object.values(RoomStatus).includes(updateRoomDto.status as RoomStatus)) {
        throw new ConflictException(`Invalid status ${updateRoomDto.status}`);
      }
      room.status = updateRoomDto.status as RoomStatus;
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
}
