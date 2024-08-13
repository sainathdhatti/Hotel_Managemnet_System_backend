import { SpaService } from "src/spa_service/spa_service.Entity";
import { Staff_Members } from "src/staff_members/staff_members.entity";
import { TimeSlot } from "src/time_slot/time_slot.Entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('spa_booking')
export class SpaBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  appointmentDate: string;

  // @ManyToOne(() => Customer, { nullable: false })
  // customer: Customer;

  @ManyToOne(() => SpaService, { nullable: false })
  service: SpaService;

  @ManyToOne(() => Staff_Members, { nullable: false })
  staffMember: Staff_Members;

  @ManyToOne(() => TimeSlot, { nullable: false })
  timeSlot: TimeSlot;

  @Column({ default: 'pending' }) 
  status: string;
}