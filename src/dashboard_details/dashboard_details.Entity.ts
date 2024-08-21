import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Dashboard_Details')
export class Dashboard_Details{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({default:0})
    count:number
}