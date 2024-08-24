import { Controller, Post, Body, Param, Put, Get, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { Room } from './rooms.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomsService.create(createRoomDto);
  }

  @Put(':id')
  async updateRoom(
    @Param('id') id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Get()
  async findAllRoom(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Get(':id')
  async findOneRoom(@Param('id') id: number): Promise<Room> {
    return this.roomsService.findOne(id);
  }

  @Delete(':id')
  async removeRoom(@Param('id') id: number){
    return this.roomsService.remove(id);
  }

  @Post('allocateRoom')
  async findAvailableRooms(categoryId:number, checkInDate:Date,checkOutDate:Date){
      return await this.findAvailableRooms(categoryId,checkInDate,checkOutDate);
  }
}
