import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { RoomCategories } from 'src/room-categories/room-categories.entity';
import { Room } from 'src/rooms/rooms.entity';

export enum BookingStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
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
  noOfAdults:number;

  @Column()
  noOfChildrens:number;

  @Column()
  TotalAmount: number;

  @ManyToOne(() => RoomCategories, (roomcategory) => roomcategory.roombookings)
  roomcategory: RoomCategories;

  @ManyToOne(() => UserEntity, (user) => user.bookings)
  user: UserEntity;

  @ManyToOne(() => Room, { eager: true })
  room: Room;
}
