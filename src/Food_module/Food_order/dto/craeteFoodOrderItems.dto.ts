import { IsNotEmpty } from 'class-validator';

export class FoodOrderItemDto {
  @IsNotEmpty()
  foodItemId: number;

  @IsNotEmpty()
  quantity: number;
}
