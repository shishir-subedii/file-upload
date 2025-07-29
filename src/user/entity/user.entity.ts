// users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ select: false }) //we use select: false to avoid returning password in queries
    password: string;

    @Column('text', { array: true, nullable: true, default: () => 'ARRAY[]::TEXT[]' })
    accessTokens: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
