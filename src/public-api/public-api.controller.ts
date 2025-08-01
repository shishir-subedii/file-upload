import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    NotFoundException,
    UseInterceptors,
    Req,
    UploadedFile,
} from '@nestjs/common';
import { EntryService } from 'src/entry/entry.service';
import { ApiTags, ApiParam, ApiBody, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { AddEntry } from './dto/addEntry.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

@ApiTags('Public API')
@Controller('public-api')
export class PublicApiController {
    constructor(private readonly entryService: EntryService) { }

    @Get(':apiKey/entries')
    @ApiOperation({ summary: 'Get all entries by API key' })
    @ApiParam({ name: 'apiKey', required: true })
    async getEntries(@Param('apiKey') apiKey: string) {
        const entries = await this.entryService.findEntriesByApikey(apiKey);
        if (!entries || entries.length === 0) {
            throw new NotFoundException('No entries found for this API key');
        }
        return {
            message: 'Entries fetched successfully',
            data: entries,
        };
    }

    @Get(':apiKey/entry')
    @ApiOperation({ summary: 'Get a single entry by API key' })
    @ApiParam({ name: 'apiKey', required: true })
    async getSingleEntry(@Param('apiKey') apiKey: string) {
        const entry = await this.entryService.findOneByApiKey(apiKey);
        if (!entry) throw new NotFoundException('Entry not found');

        return {
            message: 'Entry fetched successfully',
            data: entry,
        };
    }


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
    @Post(':apiKey/entries')
    @ApiParam({ name: 'apiKey', required: true })
    @ApiBody({ type: AddEntry })
    async addEntry(
        @Param('apiKey') apiKey: string,
        @Body() dto: AddEntry,
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        const newEntry = await this.entryService.addByApiKey(apiKey, dto, imageUrl);
        return {
            message: 'Entry created successfully',
            data: newEntry,
        };
    }

    @Put(':apiKey/entries/:entryId')
    @ApiOperation({ summary: 'Update an entry by API key' })
    @ApiParam({ name: 'apiKey', required: true })
    @ApiParam({ name: 'entryId', required: true })
    @ApiBody({ type: AddEntry })
    async updateEntry(
        @Param('apiKey') apiKey: string,
        @Param('entryId') entryId: string,
        @Body() dto: AddEntry,
    ) {
        const updated = await this.entryService.updateByApiKey(apiKey, entryId, dto);
        return {
            message: 'Entry updated successfully',
            data: updated,
        };
    }

    @Delete(':apiKey/entries/:entryId')
    @ApiOperation({ summary: 'Delete an entry by API key' })
    @ApiParam({ name: 'apiKey', required: true })
    @ApiParam({ name: 'entryId', required: true })
    async deleteEntry(
        @Param('apiKey') apiKey: string,
        @Param('entryId') entryId: string,
    ) {
        await this.entryService.removeByApiKey(apiKey, entryId);
        return {
            message: 'Entry deleted successfully',
        };
    }
}
