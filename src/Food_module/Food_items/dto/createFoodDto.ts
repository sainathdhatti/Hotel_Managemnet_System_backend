import { IsNotEmpty, IsOptional, IsString, IsNumberString, IsPositive, IsUrl } from 'class-validator';

export class CreateFoodDto {
  @IsNotEmpty()
  @IsString()
  food_name: string;

  @IsNotEmpty()
  @IsNumberString()
  //@IsPositive() 
  food_price: string;

  @IsNotEmpty()
  @IsString()
  food_description: string;

  @IsOptional() 
  @IsString()
  food_image?: string; 
}
