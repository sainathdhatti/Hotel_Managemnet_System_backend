import {IsEnum,  IsOptional } from 'class-validator';
import { BookingStatus } from '../bookings.Entity';

export class UpdateBookingForStaffDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
