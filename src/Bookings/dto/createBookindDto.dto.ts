import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString } from "class-validator";
import { BookingStatus } from "../booking.entity";
import { RoomCategories } from "src/room-categories/room-categories.entity";

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  checkInDate: Date;

  @IsNotEmpty()
  checkOutDate: Date;

  @IsOptional()
  @IsString()
  billPicUrl?: string;

  @IsNotEmpty()
  roomcategoryId:number

  @IsOptional()
  status:BookingStatus

}
