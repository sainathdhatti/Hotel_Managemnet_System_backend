import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { RoomCategories } from 'src/room-categories/room-categories.entity';
import { Room } from 'src/rooms/rooms.entity';
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

  @OneToMany(()=>FinalBilling,(finalbilling)=>finalbilling.booking)
  finalbillings:FinalBilling[]

  @OneToMany(()=>SpaBooking,(spabooking)=>spabooking.booking)
  spabookings:SpaBooking[]

  @OneToMany(()=>FoodOrder,(foodOrder)=>foodOrder.booking)
  foodOrders:FoodOrder[]
}
