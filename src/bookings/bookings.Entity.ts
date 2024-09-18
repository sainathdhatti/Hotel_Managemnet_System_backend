import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { RoomCategories } from '../room-categories/room-categories.entity';
import { Room } from '../rooms/rooms.entity';
import { Review } from '../reviews/reviews.entity';
import { FinalBilling } from '../final_billing/final_billing.Entity'; // import { FinalBilling } from 'src/final_billing/final_billing.Entity';
import { SpaBooking } from '../spa_booking/spa_bookingEntity';
import { FoodOrder } from '../Food_module/Food_order/Food_order.entity';

export enum BookingStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking {
  static find(arg0: { where: { userId: number; status: string; }; }) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  bookingId: number;

  @Column()
  checkInDate: Date;

  @Column()
  checkOutDate: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.AVAILABLE,
  })
  status: BookingStatus;

  @Column({ type: 'varchar', nullable: true })
  billPicUrl?: string;

  @Column()
  noOfDays: number;

  @Column()
  noOfAdults: number;

  @Column()
  noOfChildrens: number; // Fixed the spelling to 'noOfChildren'

  @Column()
  TotalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  advancePayment: number;

  @ManyToOne(() => RoomCategories, (roomcategory) => roomcategory.roombookings,{onDelete:'SET NULL'})
  roomcategory: RoomCategories;

  @ManyToOne(() => UserEntity, (user) => user.bookings,{onDelete:'SET NULL'})
  user: UserEntity;

  @ManyToOne(() => Room, { eager: true ,onDelete:'SET NULL'})
  room: Room;

  @OneToMany(() => Review, (review) => review.booking,{onDelete:'SET NULL'})
  reviews: Review[];

  @Column({ default: false })
  reviewLinkSent: boolean;

  @OneToMany(() => FinalBilling, (finalBilling) => finalBilling.booking,{onDelete:'SET NULL'})
  finalbillings: FinalBilling[];

  @OneToMany(() => SpaBooking, (spaBooking) => spaBooking.booking,{onDelete:'SET NULL'})
  spabookings: SpaBooking[];

  @OneToMany(() => FoodOrder, (foodOrder) => foodOrder.booking,{onDelete:'SET NULL'})
  foodOrders: FoodOrder[];
}
