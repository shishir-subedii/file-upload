import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEntryDto {
    @ApiProperty({
        description: 'Name of the file entry (unique per user)',
        example: 'logo-banner',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'UUID of the project this entry belongs to',
        example: '2a1073fc-841d-4891-b453-9eb3aaabef3d',
    })
    @IsUUID()
    @IsNotEmpty()
    projectId: string;
}
