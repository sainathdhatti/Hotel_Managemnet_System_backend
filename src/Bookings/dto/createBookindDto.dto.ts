import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString } from "class-validator";
import { BookingStatus } from "../booking.entity";

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

  @IsOptional()
  status:BookingStatus

}
