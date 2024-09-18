import { StaffCategory } from "../staff_category/staff_categoryEntity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}
@Entity("spa_members")
export class Staff_Members {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({default:true})
  password:string

  @Column({default:"available"})
  status: string;

  @Column({ length: 10, unique: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender: string;
   
  @ManyToOne(() => StaffCategory, (staffcategory) => staffcategory.staffmembers,{onDelete:'SET NULL'})
  staffcategory: StaffCategory;

}
