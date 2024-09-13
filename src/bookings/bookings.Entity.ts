import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { RoomCategories } from 'src/room-categories/room-categories.entity';
import { Room } from 'src/rooms/rooms.entity';
import { Review } from 'src/reviews/reviews.entity';
import { FinalBilling } from 'src/final_billing/final_billing.Entity';
import { SpaBooking } from 'src/spa_booking/spa_bookingEntity';
import { FoodOrder } from 'src/Food_module/Food_order/Food_order.entity';

export enum BookingStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking {
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


  @ManyToOne(() => RoomCategories, (roomcategory) => roomcategory.roombookings)
  roomcategory: RoomCategories;

  @ManyToOne(() => UserEntity, (user) => user.bookings)
  user: UserEntity;

  @ManyToOne(() => Room, { eager: true })
  room: Room;

@OneToMany(() => Review, review => review.booking)
  reviews: Review[];

  @Column({ default: false })
  reviewLinkSent: boolean;

  @OneToMany(() => FinalBilling, finalBilling => finalBilling.booking)
  finalbillings: FinalBilling[];

  @OneToMany(() => SpaBooking, spaBooking => spaBooking.booking)
  spabookings: SpaBooking[];

  @OneToMany(() => FoodOrder, foodOrder => foodOrder.booking)
  foodOrders: FoodOrder[];
}
