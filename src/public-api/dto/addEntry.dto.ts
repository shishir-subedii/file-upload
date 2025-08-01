import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddEntry {
    @ApiProperty({
        description: 'Name of the file entry (unique per user)',
        example: 'logo-banner',
    })
    @IsNotEmpty()
    @IsString()
    name: string;
}
