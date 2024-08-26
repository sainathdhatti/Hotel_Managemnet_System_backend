import { IsString, IsNumber, IsArray, ArrayNotEmpty, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateRoomCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  noOfChildren: number;

  @IsInt()
  @IsNotEmpty()
  noOfAdults: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @IsInt({ each: true })
  amenitiesIds: number[];
}
