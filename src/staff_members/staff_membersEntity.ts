import { SpaBooking } from "src/spa_booking/spa_bookingEntity";
import { StaffCategory } from "src/staff_category/staff_categoryEntity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('staff_members')
export class StaffMembers{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    firstName:string

    @Column()
    lastName:string

    @Column()
    phone:string

    @Column()
    gender:string

    @Column({unique:true})
    email:string

    @Column()
    password:string

    @Column({default:'available'})
    status:string

    @ManyToOne(()=>StaffCategory, staffcategory=>staffcategory.staffmembers)
    staffcategory:StaffCategory

    @OneToMany(()=>SpaBooking,(spabooking)=>spabooking.staffmember)
    spabookings:SpaBooking[]

}