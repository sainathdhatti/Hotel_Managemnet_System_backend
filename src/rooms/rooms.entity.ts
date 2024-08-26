import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { RoomCategories } from 'src/room-categories/room-categories.entity';

export enum RoomStatus {
  PENDING = 'pending',
  BOOKED = 'booked',
  AVAILABLE = 'available',
}
@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomNumber: number;

  @ManyToOne(() => RoomCategories, (roomCategory) => roomCategory.room, {
    eager: true,
  })
  roomCategory: RoomCategories;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;
}
