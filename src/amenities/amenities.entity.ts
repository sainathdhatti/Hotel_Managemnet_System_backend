import { RoomCategories } from "../room-categories/room-categories.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";

@Entity('amenities')
export class Amenities {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => RoomCategories, roomCategory => roomCategory.amenities)
    @JoinTable({
        name: 'room_category_amenities', 
        joinColumn: {
            name: 'amenity_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'room_category_id',
            referencedColumnName: 'id'
        }
    })
    roomCategories: RoomCategories[];
}
