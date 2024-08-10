import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodOrder } from './Food_order.entity';
import { FoodEntity } from '../Food_items/food_itm.entity';
import { UserEntity } from 'src/user/user.entity';
import { OrderItem } from './foodorderItem.entity';
import { OrderService } from './food_order.service';
import { OrderController } from './food_order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodOrder, OrderItem, FoodEntity, UserEntity]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports:[OrderService]
})
export class OrderModule {}
