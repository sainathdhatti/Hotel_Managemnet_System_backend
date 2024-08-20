import { IsOptional, IsInt, IsArray, IsPositive, ValidateNested, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './createFoodOrderDto.dto';
import { Column } from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

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

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status?: OrderStatus;

  @IsOptional()
  @IsPositive()
  totalAmount?: number; 

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  delivered_time?: Date; 
}
