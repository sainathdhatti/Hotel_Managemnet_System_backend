import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StaffStatus } from "./staff_status";
import { StaffCategory } from "src/staff_category/staff_category.Entity";

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

  @Column()
  gender:string;
   
  @ManyToOne(() => StaffCategory, (staffcategory) => staffcategory.staff_member,{nullable:false})
  staffcategory: StaffCategory;


}
