import { Staff_Members } from "src/staff_members/staff_members.Entity"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity('staffcategory')
export class StaffCategory{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    category:string

    @OneToMany(() => Staff_Members, (staff_member) => staff_member.staffcategory)
    staff_member:Staff_Members[]
}