import { Booking } from "../bookings/bookings.Entity";
import { FinalBilling } from "../final_billing/final_billing.Entity";
import { SpaService } from "../spa_service/spa_service.Entity";
import { StaffMembers } from "../staff_members/staff_membersEntity";
import { TimeSlot } from "../time_slot/time_slot.Entity";
import { UserEntity } from "../user/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
  }
  export enum SpaBookingStatus {
    PENDING = 'PENDING',
    DONE = 'DONE',
    CANCELLED='CANCELLED'
}
@Entity('spa_booking')
export class SpaBooking{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    firstName:string

    @Column()
    lastName:string

    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.MALE,
      })
      gender: Gender;

    @Column()
    booking_date:Date

    @Column({
        type: 'enum',
        enum: SpaBookingStatus,
        default: SpaBookingStatus.PENDING,
    })
    status: SpaBookingStatus;


    @ManyToOne(()=>UserEntity,(user)=>user.spabookings,{onDelete:'SET NULL'})
    user:UserEntity

    @ManyToOne(()=>SpaService,(spaservice)=>spaservice.spabookings,{onDelete:'SET NULL'})
    spaservice:SpaService

    @ManyToOne(()=>TimeSlot,(timeslot)=>timeslot.spabookings,{onDelete:'SET NULL'})
    timeslot:TimeSlot

    @ManyToOne(()=>StaffMembers,(staffmember)=>staffmember.spabookings,{onDelete:'SET NULL'})
    staffmember:StaffMembers

    @ManyToOne(()=>Booking,(booking)=>booking.spabookings,{onDelete:'SET NULL'})
    booking:Booking

}