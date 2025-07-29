import { Entry } from "src/entry/entities/entry.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text', unique: true })
    slug: string;

    @Column({ type: 'text' })
    userId: string;

    @Column({ type: 'text', unique: true })
    apiKey: string;

    @OneToMany(() => Entry, (entry) => entry.project)
    entries: Entry[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}