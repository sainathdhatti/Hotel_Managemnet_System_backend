import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { FoodEntity } from '../Food_items/food_itm.entity';
import { FoodOrder } from './Food_order.entity';
import { Exclude, Type } from 'class-transformer';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foodItemId: number; 

  @Column()
  quantity: number;

  @Column('decimal')
  price: number;

  @ManyToOne(() => FoodOrder, (order) => order.orderItems)
  @Type(() => FoodOrder)
  @Exclude({ toPlainOnly: true }) 
  order: FoodOrder;

  @ManyToOne(() => FoodEntity, (foodItem) => foodItem.food_id)
  @Type(() => FoodEntity)
  @Exclude({ toPlainOnly: true }) 
  foodItem: FoodEntity;

  
}
