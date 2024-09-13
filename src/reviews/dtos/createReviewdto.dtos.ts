import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  linkToken?: string;
}
