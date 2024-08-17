import { FoodOrder } from 'src/Food_module/Food_order/Food_order.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('user_entity')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  aadharCardNumber: string;

  @OneToMany(() => FoodOrder, (order) => order.user)
  orders: FoodOrder[];
    bookings: any;


}
