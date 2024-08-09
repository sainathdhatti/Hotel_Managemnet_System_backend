import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  roomCategoryId: number;
  @IsNotEmpty()
  @IsNumber()
  roomNumber:number


  @IsEnum(['pending', 'booked', 'available'], {
    message: 'Status must be either pending, booked, or available',
  })
  status: 'pending' | 'booked' | 'available' = 'available';
}
