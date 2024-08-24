import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { BookingStatus } from '../bookings.Entity';


export class CreateBookingDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsDate()
  @IsNotEmpty()
  checkInDate: Date;

  @IsDate()
  @IsNotEmpty()
  checkOutDate: Date;

  @IsEnum(BookingStatus)
  @IsOptional()
  status: BookingStatus;
}