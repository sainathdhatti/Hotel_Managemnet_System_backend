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
  @IsNotEmpty()
  price?: number;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsNotEmpty()
  imageUrl?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  @IsInt({ each: true })
  amenitiesIds: number[];
}
