import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateTimeSlotDto {
  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxCustomer?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bookedCustomer?: number;
}
