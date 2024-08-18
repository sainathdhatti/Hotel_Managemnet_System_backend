import { StaffMembers } from "src/staff_members/staff_membersEntity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('staff_category')
export class StaffCategory{
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    category:string

    @OneToMany(()=>StaffMembers,(staffmember)=>staffmember.staffcategory)
    staffmembers:StaffMembers[]
}