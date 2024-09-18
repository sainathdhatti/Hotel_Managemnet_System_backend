import { Booking } from '../bookings/bookings.Entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';


@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  reviewID: string;

  @Column({ unique: true })
  linkToken: string;

  @Column({ type: 'int', nullable: true })
  rating?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Booking, (b) => b.reviews)
  booking: Booking;

}
