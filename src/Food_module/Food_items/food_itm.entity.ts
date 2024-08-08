import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('foodlist')
export class FoodEntity {
  @PrimaryGeneratedColumn()
  food_id: number;

  @Column()
  food_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  food_price: string;

  @Column({ type: 'text' })
  food_description: string;

  @Column({nullable: true })
  food_image: string;
}
