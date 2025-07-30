import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/auth/AuthGuard';
import { userPayloadType } from 'src/common/types/auth.types';


@Controller('project')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({
    type: CreateProjectDto,
    description: 'Details of the project to be created',
  })
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
    const data = await this.projectService.create(createProjectDto, req['user'] as userPayloadType);
    return{
      message: 'Project created successfully',
      data: data,
    }
  }

  @ApiOperation({ summary: 'Get all projects of the user' })
  @Get()
  async findAll(@Req() req: Request) {
    const data = await this.projectService.findAll(req['user'] as userPayloadType);
    return {
      message: 'Projects retrieved successfully',
      data: data,
    };
  }

  @ApiOperation({ summary: 'Get a project by Slug' })
  @ApiParam({
    name: 'slug',
    description: 'Slug of the project to retrieve',
    type: String,
  })
  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Req() req: Request) {
    const data = await this.projectService.findOne(slug, req['user'] as userPayloadType);
    return {
      message: 'Project retrieved successfully',
      data: data,
    };
  }

  @ApiOperation({ summary: 'Update a project by Slug' })
  @ApiParam({
    name: 'slug',
    description: 'Slug of the project to update',
    type: String,
  })
  @ApiBody({
    type: UpdateProjectDto,
    description: 'Details to update the project',
  })
  @Patch(':slug')
  async update(@Param('slug') slug: string, @Body() updateProjectDto: UpdateProjectDto, @Req() req: Request) {
    const data = await this.projectService.update(slug, req['user'] as userPayloadType, updateProjectDto);
    return {
      message: 'Project updated successfully',
      data: data,
    };
  }

  @ApiOperation({ summary: 'Delete a project by Slug' })
  @ApiParam({
    name: 'slug',
    description: 'Slug of the project to delete',
    type: String,
  })
  @Delete(':slug')
  async remove(@Param('slug') slug: string, @Req() req: Request) {
    await this.projectService.remove(slug, req['user'] as userPayloadType);
    return {
      message: 'Project removed successfully',
    };
  }
}
