import { SpaService } from "src/spa_service/spa_service.Entity";
import { StaffMembers } from "src/staff_members/staff_membersEntity";
import { TimeSlot } from "src/time_slot/time_slot.Entity";
import { UserEntity } from "src/user/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
  }
  export enum BookingStatus {
    PENDING = 'pending',
    DONE = 'done',
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
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;


    @ManyToOne(()=>UserEntity,(user)=>user.spabookings)
    user:UserEntity

    @ManyToOne(()=>SpaService,(spaservice)=>spaservice.spabookings)
    spaservice:SpaService

    @ManyToOne(()=>TimeSlot,(timeslot)=>timeslot.spabookings)
    timeslot:TimeSlot

    @ManyToOne(()=>StaffMembers,(staffmember)=>staffmember.spabookings)
    staffmember:StaffMembers
}