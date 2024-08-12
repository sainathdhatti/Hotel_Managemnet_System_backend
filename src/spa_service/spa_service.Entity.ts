import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
