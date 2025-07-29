import { Project } from "src/project/entities/project.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";

@Entity('entries')
export class Entry {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'text' })
    imgUrl: string;

    // @Column({ type: 'text' })
    // project: string;

    @ManyToOne(() => Project, (project) => project.entries, { eager: true })
    project: Project;

    @Column({ type: 'text' })
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}