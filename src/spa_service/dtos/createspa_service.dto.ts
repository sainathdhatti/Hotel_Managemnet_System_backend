import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateSpaServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  service_image:string;
}
