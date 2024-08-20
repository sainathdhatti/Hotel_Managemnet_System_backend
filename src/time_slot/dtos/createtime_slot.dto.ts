import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateTimeSlotDto {
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsInt()
  @Min(1)
  maxCustomer: number = 7;

  @IsInt()
  @Min(0)
  bookedCustomer: number = 0;
}
