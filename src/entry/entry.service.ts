import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry } from './entities/entry.entity';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(Entry) private entryRepo: Repository<Entry>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
  ) { }

  async create(dto: CreateEntryDto, imgUrl: string, userId: string) {
    const project = await this.projectRepo.findOne({
      where: { id: dto.projectId },
    });

    if (!project) throw new NotFoundException('Project not found');

    const entry = this.entryRepo.create({
      name: dto.name,
      imgUrl,
      project,
      userId,
    });

    return this.entryRepo.save(entry);
  }

  async findAll(userId: string) {
    return this.entryRepo.find({
      where: { userId },
      relations: ['project'],
    });
  }

  async findByProject(userId: string, projectId: string) {
    return this.entryRepo.find({
      where: { userId, project: { id: projectId } },
      relations: ['project'],
    });
  }


  async remove(id: string, userId: string) {
    const entry = await this.entryRepo.findOne({ where: { id, userId } });
    if (!entry) throw new NotFoundException('Entry not found');
    await this.entryRepo.remove(entry);
  }

  async update(id: string, dto: CreateEntryDto, userId: string) {
    const entry = await this.entryRepo.findOne({ where: { id, userId } });
    if (!entry) throw new NotFoundException('Entry not found');

    const project = await this.projectRepo.findOneBy({ id: dto.projectId });
    if (!project) throw new NotFoundException('Project not found');

    entry.name = dto.name;
    entry.project = project;

    return this.entryRepo.save(entry);
  }
}
