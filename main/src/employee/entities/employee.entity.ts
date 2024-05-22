import { Entity, Column, PrimaryGeneratedColumn, Timestamp, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Employee {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length : 200 })
    name:string;

    @Column({ length : 8 }) 
    nip:string;

    @Column()
    roles:string;

    @Column()
    department:string;

    @Column()
    join_date:Date;

    @Column()
    photo:string;

    @Column()
    status:string;

    @Column() 
    isActive:boolean;

    @Column() 
    isDelete:boolean;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;
}