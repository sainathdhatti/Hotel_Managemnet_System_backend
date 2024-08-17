import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int', default: 8 })
  maxCustomer: number;

  @Column({ type: 'int', default: 0 })
  bookedCustomer: number;

}
