import { Booking } from "../bookings/bookings.Entity";
import { Receptionist } from "../reception/receptionist.Entity";
import { SpaBooking } from "../spa_booking/spa_bookingEntity";
import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne } from "typeorm";

@Entity('final_billing')
export class FinalBilling {
    @PrimaryGeneratedColumn()
    id:number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    bookingAmount:number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    spaAmount:number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    foodAmount:number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount:number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    advancePayment:number

    @Column()
    remainingPayment:number

    @ManyToOne(()=>Booking,(booking)=>booking.finalbillings)
    booking:Booking

    @OneToMany(()=>Receptionist,(receptionist)=>receptionist.finalBilling)
    receptionist:Receptionist[]
}