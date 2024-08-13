import { IsEnum, IsOptional, IsNumber, IsDate, IsString } from 'class-validator';
import { BookingStatus } from '../booking.entity';

export class UpdateBookingDto {
  @IsOptional()
  @IsNumber()
  roomId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsDate()
  checkInDate?: Date;

  @IsOptional()
  @IsDate()
  checkOutDate?: Date;

  @IsOptional()
  @IsNumber()
  roomNumber?: number;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  billPicUrl?: string;
}
