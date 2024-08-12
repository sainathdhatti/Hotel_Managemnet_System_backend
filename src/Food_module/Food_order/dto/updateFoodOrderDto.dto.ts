
import { IsOptional, IsInt, IsArray, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './createFoodOrderDto.dto';


export class UpdateOrderDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  userId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems?: OrderItemDto[];

  @IsOptional()
  @IsPositive()
  totalAmount?: number; 
}
