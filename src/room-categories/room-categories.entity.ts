import { Amenities } from 'src/amenities/amenities.entity';
import { Room } from 'src/rooms/rooms.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roomcategories')
export class RoomCategories {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @Column({ nullable: true, default: 0 })
  noOfChildren: number;

  @Column({ nullable: true, default: 0 })
  noOfAdults: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true, default: 0 },)
  price: number;

  @Column({ type: 'text',nullable: true, })
  description: string;

  @Column()
  imageUrl: string;

  @ManyToMany(() => Amenities, amenity => amenity.roomCategories)
    amenities: Amenities[];
  
    @OneToMany(() => Room, (room) => room.roomCategory)
    rooms: Room[];
    
@OneToMany(() => Room, (room) => room.roomCategory)
  book: Room[];
}
