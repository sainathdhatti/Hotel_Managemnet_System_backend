import { FamilyMembers } from "src/family_members/family_membersEntity";
import { SpaService } from "src/spa_service/spa_service.Entity";
import { StaffMembers } from "src/staff_members/staff_membersEntity";
import { TimeSlot } from "src/time_slot/time_slot.Entity";
import { UserEntity } from "src/user/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity('spa_booking')
export class SpaBooking{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    booking_date:Date

    @Column({default:'pending'})
    status:string

    @ManyToOne(()=>UserEntity,(user)=>user.spabookings)
    user:UserEntity

    @ManyToOne(()=>FamilyMembers,(familymember)=>familymember.spabookings)
    familymember:FamilyMembers

    @ManyToOne(()=>SpaService,(spaservice)=>spaservice.spabookings)
    spaservice:SpaService

    @ManyToOne(()=>TimeSlot,(timeslot)=>timeslot.spabookings)
    timeslot:TimeSlot

    @ManyToOne(()=>StaffMembers,(staffmember)=>staffmember.spabookings)
    staffmember:StaffMembers
}