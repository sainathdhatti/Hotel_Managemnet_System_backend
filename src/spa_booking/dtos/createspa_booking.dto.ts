import { IsNotEmpty, IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsDate()
  appointmentDate: string;

  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @IsNotEmpty()
  @IsNumber()
  staffMemberId: number;

  @IsNotEmpty()
  @IsNumber()
  timeSlotId: number;

  @IsOptional()
  @IsString()
  status?: string;
}
