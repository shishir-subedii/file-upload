import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { JwtAuthGuard } from 'src/common/auth/AuthGuard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Entry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuid();
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Create a new entry with file upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Entry with image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'logo1' },
        projectId: { type: 'string', format: 'uuid' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name', 'projectId', 'file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Entry created successfully',
    schema: {
      example: {
        message: 'Entry created successfully',
        data: {
          id: 'uuid',
          name: 'logo1',
          imgUrl: 'http://localhost:3000/uploads/uuid.jpg',
          userId: 'user-uuid',
          project: {
            id: 'project-uuid',
            name: 'project name',
          },
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      },
    },
  })
  async create(
    @Req() req,
    @Body() body: CreateEntryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    const created = await this.entryService.create(body, imageUrl, userId);
    return {
      message: 'Entry created successfully',
      data: created,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all entries for the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entries retrieved successfully',
    schema: {
      example: {
        message: 'Entries retrieved',
        data: [
          {
            id: 'uuid',
            name: 'logo1',
            imgUrl: 'http://localhost:3000/uploads/uuid.jpg',
            userId: 'user-uuid',
            project: {
              id: 'project-uuid',
              name: 'project name',
            },
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
      },
    },
  })
  async findAll(@Req() req) {
    const userId = req.user.id;
    const entries = await this.entryService.findAll(userId);
    return {
      message: 'Entries retrieved',
      data: entries,
    };
  }

  @ApiOperation({ summary: 'Get all entries for a specific project' })
  @ApiParam({ name: 'projectId', description: 'UUID of the project' })
  @ApiResponse({
    status: 200,
    description: 'Entries retrieved successfully',
    schema: {
      example: {
        message: 'Entries retrieved for project',
        data: [
          {
            id: 'uuid',
            name: 'logo1',
            imgUrl: 'http://localhost:3000/uploads/uuid.jpg',
            userId: 'user-uuid',
            project: {
              id: 'project-uuid',
              name: 'project name',
            },
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
      },
    },
  })
  @Get('project/:projectId')
  async findByProject(
    @Req() req,
    @Param('projectId') projectId: string
  ) {
    const userId = req.user.id;
    const entries = await this.entryService.findByProject(userId, projectId);
    return {
      message: 'Entries retrieved for project',
      data: entries,
    };
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete an entry by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the entry to delete' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entry deleted successfully',
    schema: {
      example: {
        message: 'Entry deleted successfully',
      },
    },
  })
  async remove(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    await this.entryService.remove(id, userId);
    return {
      message: 'Entry deleted successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing entry by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the entry to update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entry updated successfully',
    schema: {
      example: {
        message: 'Entry updated',
        data: {
          id: 'uuid',
          name: 'updated-name',
          imgUrl: 'http://localhost:3000/uploads/uuid.jpg',
          userId: 'user-uuid',
          project: {
            id: 'project-uuid',
            name: 'project name',
          },
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
        },
      },
    },
  })
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() body: CreateEntryDto,
  ) {
    const userId = req.user.id;
    const updated = await this.entryService.update(id, body, userId);
    return {
      message: 'Entry updated',
      data: updated,
    };
  }
}
