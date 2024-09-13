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
  food_name:string

  @Column()
  quantity: number;

  @Column('decimal')
  price: number;

  @ManyToOne(() => FoodOrder, (order) => order.orderItems,{ onDelete:'SET NULL' })
  @Type(() => FoodOrder)
  @Exclude({ toPlainOnly: true }) 
  order: FoodOrder;

  @ManyToOne(() => FoodEntity, (foodItem) => foodItem.food_id,{ onDelete:'SET NULL' })
  @Type(() => FoodEntity)
  @Exclude({ toPlainOnly: true }) 
  foodItem: FoodEntity;

  
}
