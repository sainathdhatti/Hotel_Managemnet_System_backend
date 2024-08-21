import { FoodOrder } from 'src/Food_module/Food_order/Food_order.entity';
import { SpaBooking } from 'src/spa_booking/spa_bookingEntity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('user_entity')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ unique: true })
  aadharCardNumber: string;

  @Column({ type: 'varchar', nullable: true })
  resetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry?: Date;

  @OneToMany(() => FoodOrder, (order) => order.user)
  orders: FoodOrder[];
    bookings: any;

  @OneToMany(()=>SpaBooking,(spabooking)=>spabooking.user)
  spabookings:SpaBooking[]

}
