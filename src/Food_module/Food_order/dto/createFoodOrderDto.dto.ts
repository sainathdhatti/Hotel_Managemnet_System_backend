import { IsInt, IsArray, IsNotEmpty, IsPositive, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  foodItemId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  // @IsInt()
  // @IsPositive()
  // @IsNotEmpty()
  // bookingId: number;
}

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @IsNotEmpty()
  @IsNumber()
  bookingId:number
}
