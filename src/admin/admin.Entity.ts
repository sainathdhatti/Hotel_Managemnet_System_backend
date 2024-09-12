import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admin')
export class Admin{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({length:10, unique:true})
    phone: string;

    @Column({nullable:false})
    password: string;

    @Column({ type: 'varchar', nullable: true })
    resetToken?: string;

    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpiry?: Date;

}
