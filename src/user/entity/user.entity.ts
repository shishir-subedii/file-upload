// users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({select: false}) //we use select: false to avoid returning password in queries
    password: string;

    @Column({ nullable: true, default: null, type: 'text', select: false }) // Access token is nullable and not selected by default
    accessToken: string | null;

    //find a better way to handle roles
    @Column({
        type: 'enum',
        enum: ['user', 'admin'],
        default: 'user',
    })
    role: 'user' | 'admin';
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
