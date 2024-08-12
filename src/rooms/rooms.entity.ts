import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RoomCategories } from 'src/room-categories/room-categories.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  roomNumber: number;
  @ManyToOne(() => RoomCategories, (roomCategory) => roomCategory.rooms, {
    eager: true,
  })
  roomCategory: RoomCategories;

  @Column({
    type: 'enum',
    enum: ['pending', 'booked', 'available'],
    default: 'available',
  })
  status: 'pending' | 'booked' | 'available';
}
