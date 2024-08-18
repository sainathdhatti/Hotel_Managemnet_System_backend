import { UserEntity } from "src/user/user.entity";
import { Entity, PrimaryGeneratedColumn,Column, ManyToMany, ManyToOne } from "typeorm";

@Entity('family_members')
export class FamilyMembers{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    firstName:string

    @Column()
    lastName:string

    @Column()
    gender:string

    @ManyToOne(()=> UserEntity,(user)=>user.familymembers)
    user:UserEntity

}