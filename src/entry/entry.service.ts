import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Entry } from './entities/entry.entity';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Project } from 'src/project/entities/project.entity';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class EntryService {
  constructor(
    private projectService: ProjectService,
    @InjectRepository(Entry) private entryRepo: Repository<Entry>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    private dataSource: DataSource, // Inject DataSource
  ) { }

  async create(dto: CreateEntryDto, imgUrl: string, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await queryRunner.manager.findOne(Project, {
        where: { id: dto.projectId },
      });

      if (!project) throw new NotFoundException('Project not found');

      const entry = this.entryRepo.create({
        name: dto.name,
        imgUrl,
        project,
        userId,
        apiKey: project.apiKey,
      });

      const savedEntry = await queryRunner.manager.save(Entry, entry);

      await queryRunner.commitTransaction();
      return savedEntry;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create entry');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: string) {
    return this.entryRepo.find({
      where: { userId }
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

  async findEntriesByApikey(apiKey: string) {
    return this.entryRepo.find({
      where: { apiKey }
    });
  }
  
  async findOneByApiKey(apiKey: string) {
    return this.entryRepo.findOne({
      where: { apiKey }
    });
  }

  async addByApiKey(apiKey: string, dto: CreateEntryDto, imgUrl: string) {
    const project = await this.projectService.findByApiKey(apiKey);
    if (!project) throw new NotFoundException('Project not found');

    const entry = this.entryRepo.create({
      name: dto.name,
      imgUrl,
      project,
      userId: project.userId,
      apiKey: project.apiKey
    });

    return this.entryRepo.save(entry);
  }

  async removeByApiKey(apiKey: string, entryId: string) {
    const entry = await this.entryRepo.findOne({
      where: { id: entryId, apiKey }
    });

    if (!entry) throw new NotFoundException('Entry not found');

    await this.entryRepo.remove(entry);
  }

  async updateByApiKey(apiKey: string, entryId: string, dto: CreateEntryDto) {
    const entry = await this.entryRepo.findOne({
      where: { id: entryId, apiKey }
    });

    if (!entry) throw new NotFoundException('Entry not found');

    const project = await this.projectService.findByApiKey(apiKey);
    if (!project) throw new NotFoundException('Project not found');

    entry.name = dto.name;
    entry.project = project;

    return this.entryRepo.save(entry);
  }
}
