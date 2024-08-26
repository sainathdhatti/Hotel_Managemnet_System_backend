import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';


export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  roomCategoryId: number;

  @IsNotEmpty()
  @IsNumber()
  roomNumber: number;

}
