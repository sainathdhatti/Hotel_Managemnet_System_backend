import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Hotel_Details')
export class Hotel_Details{
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    name:string

    @Column({ type: 'text'})
    description:string

    @Column()
    address:string
    
    @Column({ length: 10, unique: true })
    Phone:string

    @Column({unique:true})
    Email:string

    @Column()
    facebookLink:string

    @Column()
    instagramLink:string

    @Column()
    twitterLink:string
}