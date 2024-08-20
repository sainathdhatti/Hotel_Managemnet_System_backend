import { SpaBooking } from "src/spa_booking/spa_bookingEntity";
import { UserEntity } from "src/user/user.entity";
import { Entity, PrimaryGeneratedColumn,Column, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity('family_members')
export class FamilyMembers{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    firstName:string

    @Column()
    lastName:string

    @Column()
    gender:string

    @OneToMany(()=>SpaBooking,(spabooking)=>spabooking.familymember)
    spabookings:SpaBooking[]

}