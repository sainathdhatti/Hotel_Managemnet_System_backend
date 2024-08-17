import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('staff_category')
export class StaffCategory{
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    category:string
}