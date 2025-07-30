import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { userPayloadType } from 'src/common/types/auth.types';
import * as crypto from 'crypto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) 
    private projectRepository: Repository<Project>
  ){}
  async create(createProjectDto: CreateProjectDto, user: userPayloadType) {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const slug = createProjectDto.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const project = this.projectRepository.create({
      ...createProjectDto,
      userId: user.id,
      apiKey,
      slug
    });
    return this.projectRepository.save(project);
  }

  async findAll(user: userPayloadType) {
    return await this.projectRepository.find({ where: { userId: user.id } });
  }

  async findOne(slug: string, user: userPayloadType) {
    const project = await this.projectRepository.findOne({ where: { slug, userId: user.id } });
    if (!project) {
      throw new Error(`Project with slug ${slug} not found`);
    }
    return project;
  }

  async update(slug: string, user: userPayloadType, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(slug, user);
    if(!project) {
      throw new Error(`Project with slug ${slug} not found`);
    }
    const projectData = this.projectRepository.merge(project, updateProjectDto);
    return this.projectRepository.save(projectData);
  }

  async remove(slug: string, user: userPayloadType) {
    const project = await this.findOne(slug, user);
    if (!project) {
      throw new Error(`Project with slug ${slug} not found`);
    }
    return this.projectRepository.remove(project);
  }

  async findByApiKey(apiKey: string) {
    return this.projectRepository.findOne({ where: { apiKey } });
  }
}
