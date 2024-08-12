import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Exclude, Type } from 'class-transformer';
import { OrderItem } from './foodorderItem.entity';

@Entity('food_order')
export class FoodOrder {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column('decimal')
  totalAmount: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @Type(() => UserEntity)
  user: UserEntity;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  @Type(() => OrderItem)
  @Exclude({ toPlainOnly: true }) 
  orderItems: OrderItem[];
}
