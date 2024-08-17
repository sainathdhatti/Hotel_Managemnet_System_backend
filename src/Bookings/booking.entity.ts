import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Room } from 'src/rooms/rooms.entity';
import { UserEntity } from 'src/user/user.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
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

  @ManyToOne(() => Room, (room) => room.bookings)
  room: Room;

  @ManyToOne(() => UserEntity, (user) => user.bookings)
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column()
  roomNumber: number;

  @Column({ type: 'varchar', nullable: true })
  billPicUrl?: string;
}
