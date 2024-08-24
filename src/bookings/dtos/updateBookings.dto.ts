import { IsDate, IsEnum, IsInt, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsDate()
  checkInDate?: Date;

  @IsOptional()
  @IsDate()
  checkOutDate?: Date;

}
