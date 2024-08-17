import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('contact_us')
export class Contact_Us{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column({unique:true})
    Email:string;

    @Column()
    Subject:string;

    @Column({ type: 'varchar', length: 255 })
    Message:string
}