import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('superadmin')
export class SuperAdmin{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    name:string
    @Column()
    email:string
    @Column()
    password:string
    @Column()
    phone:string
}