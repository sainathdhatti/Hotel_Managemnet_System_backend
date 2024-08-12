import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';

export class UpdateSpaServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;
}
