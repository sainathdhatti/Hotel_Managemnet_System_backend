import { IsString, IsNumber, IsArray, ArrayNotEmpty, IsNotEmpty, IsInt } from 'class-validator';

export class CreateRoomCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  noOfChildren: number;

  @IsNumber()
  @IsNotEmpty()
  noOfAdults: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  amenitiesIds: number[];
}
