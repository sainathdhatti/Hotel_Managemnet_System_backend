import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";


@Entity('foodlist')
export class FoodEntity {
  @PrimaryGeneratedColumn()
  food_id: number;

  @Column({ type: 'varchar', length: 255 })
  food_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  food_price: number;

  @Column({ type: 'text' })
  food_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  food_image: string;

  
}
