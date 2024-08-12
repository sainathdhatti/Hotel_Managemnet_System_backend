import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './rooms.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { RoomCategories } from 'src/room-categories/room-categories.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,

    @InjectRepository(RoomCategories)
    private roomCategoriesRepository: Repository<RoomCategories>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const room = new Room();
    room.roomNumber = createRoomDto.roomNumber;
    // Find and assign the room category
    const roomCategory = await this.roomCategoriesRepository.findOneBy({
      id: createRoomDto.roomCategoryId,
    });

    if (roomCategory) {
      room.roomCategory = roomCategory;
    }

    room.status = createRoomDto.status || 'available';

    return this.roomsRepository.save(room);
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomsRepository.findOne({ where: { id } });

    if (!room) {
      throw new Error('Room not found');
    }
    if (room.roomNumber) {
      room.roomNumber = updateRoomDto.roomNumber;
    }

    if (updateRoomDto.roomCategoryId) {
      const roomCategory = await this.roomCategoriesRepository.findOneBy({
        id: updateRoomDto.roomCategoryId,
      });

      if (roomCategory) {
        room.roomCategory = roomCategory;
      }
    }

    if (updateRoomDto.status) {
      room.status = updateRoomDto.status;
    }

    return this.roomsRepository.save(room);
  }

  async findAll() {
    return this.roomsRepository.find();
  }

  async findOne(id: number) {
    return this.roomsRepository.findOne({ where: { id } });
  }
  async remove(id: number) {
    const room = await this.roomsRepository.findOne({ where: { id } });

    if (!room) {
      throw new Error('Room not found');
    }

    await this.roomsRepository.remove(room);
    return 'room deleted successfully';
  }
}
