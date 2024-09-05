import { SpaBooking } from 'src/spa_booking/spa_bookingEntity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('spa_services')
export class SpaService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  service_image: string;

  @OneToMany(()=>SpaBooking,(spabooking)=>spabooking.spaservice)
  spabookings:SpaBooking[]

}
