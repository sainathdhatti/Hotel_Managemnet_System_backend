import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Exclude, Type } from 'class-transformer';
import { OrderItem } from './foodorderItem.entity';
import { OrderStatus } from './dto/updateFoodOrderDto.dto';

@Entity('food_order')
export class FoodOrder {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  order_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivered_time: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @Type(() => UserEntity)
  user: UserEntity;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  @Type(() => OrderItem)
  @Exclude({ toPlainOnly: true }) 
  orderItems: OrderItem[];
}
