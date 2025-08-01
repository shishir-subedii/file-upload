import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ApiKeyParamDto {
    @ApiProperty({ example: 'your-api-key-here' })
    @IsString()
    @IsNotEmpty()
    apiKey: string;
}
