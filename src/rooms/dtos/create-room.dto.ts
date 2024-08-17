import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RoomStatus } from '../rooms.entity';


export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  roomCategoryId: number;

  @IsNotEmpty()
  @IsNumber()
  roomNumber: number;

  @IsEnum(RoomStatus, {
    message: 'Status must be either pending, booked, or available',
  })
  status: RoomStatus = RoomStatus.AVAILABLE; 
}
